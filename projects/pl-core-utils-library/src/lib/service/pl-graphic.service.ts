import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { PlHttpService } from './pl-http.service';

/**
 * @author l.piciollo
 * classe di servizio per utilità grafica
 */
@Injectable({
  providedIn: 'root'
})
export class PlGraphicService {

  constructor(private plHttpService:PlHttpService) { }

  /**
   * @author l.piciollo
   * si occupa di convertire un immagine esposta tramite blob url, in formato base 64
   * @param imageUrl 
   */
  public image2base64(imageUrl: string): Promise<any> {
    return new Promise<any>((ok, ko) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", imageUrl, false);
        xhr.overrideMimeType("image/svg+xml");
        xhr.send("");
        var s = new XMLSerializer().serializeToString(xhr.responseXML.documentElement)
        ok("data:image/svg+xml;base64," + window.btoa(s))
      } catch (e) {
        ko(e);
      }
    })
  }
  /*************************************************************************************** */
  /**
   * @author l.piciollo
   * Funzione che esporta l'intero elemento svg in un file per la visualizzazione in un browser, verrà mantenuto fedelmente il costrutto
   * dell'elemento SVG
   * @param elementSVG : elemento svg da elaborare
   * @param nameFIle : nome del file da salvare
   */
  public svg2File(elementSVG: HTMLElement, nameFIle: string): Observable<boolean> {
    return new Observable<any>(obs => {
      try {
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(elementSVG);
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        this.plHttpService.DOWNLOADURL(url, nameFIle);
        obs.next(true)
      } catch (e) { obs.error(e) }
    })

  }

  //*****************************************************************************************************
  /**
   * @author l.piciollo
   * Funzine per la creazione del jpeg partendo da un dom.
   * l'osservatore ritorna il link all'immagine per il download
   * @param elementSVG   elemento SVG dom da cattuare
   */
  public dom2jpeg(elementSVG: HTMLElement): Observable<string> {
    return new Observable<string>(response => {
      htmlToImage.toJpeg(elementSVG, { quality: 1, backgroundColor: "white" })
        .then((dataUrl) => {
          response.next(dataUrl);
          response.complete()
        });
    })
  }
  //***************************************************************************************************** */
  /**
   * Funzione per la creazione del canvas, contenente l'immagine del DOM referenziato. non verranno presi in considerazione
   * tag SVG grafici. ma solo html semplice comprese le immagini
   * la funzione restituisce in callback il canvas creato, in modo da poterlo aggiungere al dom o altro.
   * mentre in observer torna la url da passare alla funaione di download
   * 
   * @param elementoDom : elemento dom da cattuare
   * @param call  : callback di ritorno dove iniettare il canvas creato.
   */
  public domToCanvas(elementoDom: HTMLElement, call: (canvas: HTMLElement) => void): Observable<string> {
    let pr = window.devicePixelRatio;
    let prString = (pr * 100).toFixed(0);
    return new Observable<any>(response => {
      html2canvas(elementoDom, {
        allowTaint: true
      }).then(canvas => {
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          response.next(url);
          response.complete();
          if (call) call(canvas);
        });
      }).catch(e => {
        response.error(e);
      });
    })
  }
  //***************************************************************************************************** */

  /**
   * Funzione che si occupa di scaricare un'immagine da un contenitore canvas, il canvas deve contenere un immagine non un html.
   * questa funzionalità puo essere usata in risposta a domToCanvas
   * viene ritornata la URL del blob da poeter scaricare
   * @param canvas :oggetto canvas da scaricare   
   */
  public canvasToImg(canvas: HTMLElement): Observable<string> {
    return new Observable<string>(response => {
      try {
        (<any>canvas).toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          response.next(url);
          response.complete();
        });
      } catch (e) {
        response.error(e);
      }
    })
  }

  /**
   * Funzionalita per la creazione di un immagine a partire da un svg. la funzione restituisce in callback un canvas eventualmente
   * da mostrare a schermo e la url  del file in formato blob nell'osservable
   * @param svgElement : svg element del dom
   * @param callBack : funzione di ritorno per la consegna del canvas
   */
  public svgToImage(svgElement: HTMLElement, call: (canvas) => void): Observable<any> {
    return new Observable<any>(obs => {
      var canvas = document.createElement("canvas");
      var bBox = (<any>svgElement).getBBox();
      canvas.width = svgElement.scrollWidth;;
      canvas.height = svgElement.scrollHeight;
      let ctx = canvas.getContext("2d");
      let svgString = new XMLSerializer().serializeToString(svgElement);
      let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      let img = new Image();
      let url = URL.createObjectURL(svg);
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL();
        obs.next(dataURL);
        obs.complete();
        if (call != null) call(canvas);
      };
      img.src = url;
      img.dispatchEvent(new Event("load"));
    })
  }
  //***************************************************************************************************** */
 
 
}
