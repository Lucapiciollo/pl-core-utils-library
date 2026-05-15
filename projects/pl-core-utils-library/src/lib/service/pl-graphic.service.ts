import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';

import { CONTENT_TYPE, PlHttpService } from './pl-http.service';

/**
 * Classe di servizio per utilità grafiche.
 */
@Injectable({
  providedIn: 'root'
})
export class PlGraphicService {
  constructor(private plHttpService: PlHttpService) {}

  /**
   * Converte un'immagine esposta tramite URL/blob URL in formato base64.
   */
  public image2base64(imageUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', imageUrl, false);
        xhr.overrideMimeType('image/svg+xml');
        xhr.send('');

        if (!xhr.responseXML?.documentElement) {
          reject(new Error('Invalid SVG response'));
          return;
        }

        const serializedSvg = new XMLSerializer().serializeToString(
          xhr.responseXML.documentElement
        );

        resolve('data:image/svg+xml;base64,' + window.btoa(serializedSvg));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Esporta un elemento SVG in un file.
   */
  public svg2File(elementSVG: HTMLElement, nameFile: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      try {
        let source = new XMLSerializer().serializeToString(elementSVG);

        if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(
            /^<svg/,
            '<svg xmlns="http://www.w3.org/2000/svg"'
          );
        }

        if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(
            /^<svg/,
            '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
          );
        }

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        const svgBlob = new Blob([source], {
          type: CONTENT_TYPE['SVG+XML']
        });

        const url = URL.createObjectURL(svgBlob);

        this.plHttpService.DOWNLOADURL(url, nameFile);

        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Converte un elemento SVG/HTML in JPEG tramite html-to-image.
   */
  public svgToJpeg(elementSVG: HTMLElement): Observable<string> {
    return new Observable<string>(observer => {
      htmlToImage
        .toJpeg(elementSVG, {
          quality: 1,
          backgroundColor: 'white'
        })
        .then(dataUrl => {
          observer.next(dataUrl);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   * Crea un canvas a partire da un elemento DOM.
   *
   * Non tutti gli SVG complessi potrebbero essere renderizzati correttamente.
   * Restituisce l'URL blob del canvas e passa il canvas alla callback.
   */
  public domToCanvas(
    elementoDom: HTMLElement,
    call?: (canvas: HTMLCanvasElement) => void
  ): Observable<string> {
    return new Observable<string>(observer => {
      if (typeof window === 'undefined') {
        observer.error(new Error('domToCanvas is available only in browser environments'));
        return;
      }

      html2canvas(elementoDom, {
        allowTaint: true
      })
        .then(canvas => {
          canvas.toBlob(blob => {
            if (!blob) {
              observer.error(new Error('Unable to create canvas blob'));
              return;
            }

            const url = URL.createObjectURL(blob);

            observer.next(url);
            observer.complete();

            if (call) {
              call(canvas);
            }
          });
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   * Crea un URL blob a partire da un canvas.
   */
  public canvasToImg(canvas: HTMLCanvasElement): Observable<string> {
    return new Observable<string>(observer => {
      try {
        canvas.toBlob(blob => {
          if (!blob) {
            observer.error(new Error('Unable to create canvas blob'));
            return;
          }

          const url = URL.createObjectURL(blob);

          observer.next(url);
          observer.complete();
        });
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Crea una immagine a partire da un SVG.
   * Restituisce il dataURL e passa il canvas alla callback.
   */
  public svgToImage(
    svgElement: SVGGraphicsElement,
    call?: (canvas: HTMLCanvasElement) => void
  ): Observable<string> {
    return new Observable<string>(observer => {
      try {
        if (typeof document === 'undefined') {
          observer.error(new Error('svgToImage is available only in browser environments'));
          return;
        }

        const canvas = document.createElement('canvas');
        const width = svgElement.scrollWidth || svgElement.getBoundingClientRect().width;
        const height = svgElement.scrollHeight || svgElement.getBoundingClientRect().height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          observer.error(new Error('Unable to get canvas 2D context'));
          return;
        }

        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], {
          type: 'image/svg+xml;charset=utf-8'
        });

        const img = new Image();
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0);

            const dataURL = canvas.toDataURL();

            observer.next(dataURL);
            observer.complete();

            if (call) {
              call(canvas);
            }
          } catch (error) {
            observer.error(error);
          } finally {
            URL.revokeObjectURL(url);
          }
        };

        img.onerror = error => {
          URL.revokeObjectURL(url);
          observer.error(error);
        };

        img.src = url;
      } catch (error) {
        observer.error(error);
      }
    });
  }
}