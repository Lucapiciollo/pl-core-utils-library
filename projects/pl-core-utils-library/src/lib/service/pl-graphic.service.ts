import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';

import { CONTENT_TYPE, PlHttpService } from './pl-http.service';

/**
 * Classe di servizio per utility grafiche.
 */
@Injectable({
  providedIn: 'root'
})
export class PlGraphicService {
  constructor(private plHttpService: PlHttpService) {}

  /**
   * Converte un'immagine SVG caricata da URL in base64.
   *
   * Nota: usa XMLHttpRequest sincrono per retrocompatibilità con il comportamento storico.
    * @param imageUrl URL immagine SVG da convertire.
    * @returns Promise con data URL base64 dell'immagine.
   */
  /**
   * Converte un'immagine SVG caricata da URL in una stringa base64 (data URL).
   * Usa XMLHttpRequest sincrono per retrocompatibilità.
   * @param imageUrl URL immagine SVG da convertire.
   * @returns Promise con data URL base64 dell'immagine.
   * @example
   * service.image2base64('/assets/logo.svg').then(base64 => ...);
   */
  public image2base64(imageUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (typeof XMLHttpRequest === 'undefined' || typeof window === 'undefined') {
          reject(new Error('image2base64 is available only in browser environments'));
          return;
        }

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
   * Esporta un elemento SVG in un file .svg.
    * @param elementSVG Elemento SVG/HTML da serializzare.
    * @param nameFile Nome file da scaricare.
    * @returns Observable che emette `true` a completamento download.
   */
  /**
   * Esporta un elemento SVG/HTML in un file .svg scaricabile (browser only).
   * @param elementSVG Elemento SVG/HTML da serializzare.
   * @param nameFile Nome file da scaricare.
   * @returns Observable che emette `true` a completamento download.
   * @example
   * service.svg2File(document.getElementById('mysvg'), 'export.svg').subscribe();
   */
  public svg2File(elementSVG: HTMLElement | SVGElement, nameFile: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      try {
        if (typeof XMLSerializer === 'undefined' || typeof URL === 'undefined') {
          observer.error(new Error('svg2File is available only in browser environments'));
          return;
        }

        let source = new XMLSerializer().serializeToString(elementSVG);

        if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(
            /^<svg/,
            '<svg xmlns="http://www.w3.org/2000/svg"'
          );
        }

        if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
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
    * @param elementSVG Elemento sorgente da convertire.
    * @returns Observable con data URL JPEG.
   */
  public svgToJpeg(elementSVG: HTMLElement | SVGElement): Observable<string> {
    return new Observable<string>(observer => {
      htmlToImage
        .toJpeg(elementSVG as HTMLElement, {
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
   * Restituisce l'URL blob del canvas e passa il canvas alla callback, se presente.
    * @param elementoDom Elemento DOM da renderizzare su canvas.
    * @param call Callback opzionale con il canvas creato.
    * @returns Observable con blob URL del canvas.
   */
  public domToCanvas(
    elementoDom: HTMLElement,
    call?: (canvas: HTMLCanvasElement) => void
  ): Observable<string> {
    return new Observable<string>(observer => {
      if (typeof window === 'undefined' || typeof URL === 'undefined') {
        observer.error(new Error('domToCanvas is available only in browser environments'));
        return;
      }

      html2canvas(elementoDom, {
        allowTaint: true,
        useCORS: true
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
    * @param canvas Canvas da convertire in blob URL.
    * @returns Observable con blob URL dell'immagine.
   */
  public canvasToImg(canvas: HTMLCanvasElement): Observable<string> {
    return new Observable<string>(observer => {
      try {
        if (typeof URL === 'undefined') {
          observer.error(new Error('canvasToImg is available only in browser environments'));
          return;
        }

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
   * Crea una immagine dataURL a partire da un SVG.
   * Restituisce il dataURL e passa il canvas alla callback, se presente.
    * @param svgElement Elemento SVG/DOM da convertire.
    * @param call Callback opzionale con canvas risultante.
    * @returns Observable con dataURL dell'immagine prodotta.
   */
  public svgToImage(
    svgElement: SVGGraphicsElement | SVGElement | HTMLElement,
    call?: (canvas: HTMLCanvasElement) => void
  ): Observable<string> {
    return new Observable<string>(observer => {
      try {
        if (typeof document === 'undefined' || typeof URL === 'undefined') {
          observer.error(new Error('svgToImage is available only in browser environments'));
          return;
        }

        const canvas = document.createElement('canvas');
        const rect = svgElement.getBoundingClientRect();

        const width = (svgElement as HTMLElement).scrollWidth || rect.width || 300;
        const height = (svgElement as HTMLElement).scrollHeight || rect.height || 150;

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
            ctx.drawImage(img, 0, 0, width, height);

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