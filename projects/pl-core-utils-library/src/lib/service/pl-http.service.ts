/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2019-11-06 22:10:04
 * @modify date 2019-11-06 22:10:04
 * @desc [description]
 */
import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from "angular2-uuid";
import { forkJoin, Observable, of, Subject, Subscriber } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PlHttpRequest } from '../bean/Pl-http-request';
import { PlCoreUtils } from '../pl-core-utils-library.service';

/**@ignore */
declare const require: any;
/**@ignore */
declare const $: any;




/** eventi registrati per PLlibrary */
export enum TYPE_EVENT_NETWORK {
  PL_BREACK_NET = "PL:BREACK_NET"
}

/**
 * @author l.piciollo
 * Tipologica per identificare il tipo di chiamata http che si sta facendo
 */
export enum RESPONSE_TYPE {
  "TEXT" = "pplication/text",
  "ARRAYBUFFER" = "arraybuffer",
  "BLOB" = "blob",
  "MS_STREAM" = "ms-stream",
  "JAVA-ARCHIVE" = "application/java-archive",
  "EDI-X12" = "application/EDI-X12",
  "EDIFACT" = "application/EDIFACT",
  "JAVASCRIPT" = "application/javascript",
  "OCTET-STREAM" = "application/octet-stream",
  "OGG" = "application/ogg",
  "PDF" = "application/pdf",
  "XHTML+XML" = "application/xhtml+xml",
  "X-SHOCKWAVE-FLASH" = "application/x-shockwave-flash",
  "JSON" = "application/json",
  "LD+JSON" = "application/ld+json",
  "XML" = "application/xml",
  "ZIP" = "application/zip",
  "X-WWW-FORM-URLENCODED" = "application/x-www-form-urlencoded",
  "MPEG" = "audio/mpeg",
  "X-MS-WMA" = "audio/x-ms-wma",
  "VND.RN-REALAUDIO" = "audio/vnd.rn-realaudio",
  "X-WAV" = "audio/x-wav",
  "GIF" = "image/gif",
  "JPEG" = "image/jpeg",
  "PNG" = "image/png",
  "TIFF" = "image/tiff",
  "VND.MICROSOFT.ICON" = "image/vnd.microsoft.icon",
  "X-ICON" = "image/x-icon",
  "VND.DJVU" = "image/vnd.djvu",
  "SVG+XML" = "image/svg+xml",
  "MIXED" = "multipart/mixed",
  "ALTERNATIVE" = "multipart/alternative",
  "RELATED" = "multipart/related",
  "FORM-DATA" = "multipart/form-data; boundary=something",
  "CSS" = "text/css",
  "CSV" = "text/csv",
  "HTML" = "text/html",
  "PLAIN" = "text/plain",
  "MP4" = "video/mp4",
  "QUICKTIME" = "video/quicktime",
  "X-MS-WMV" = "video/x-ms-wmv",
  "X-MSVIDEO" = "video/x-msvideo",
  "X-FLV" = "video/x-flv",
  "WEBM" = "video/webm",
  "VND.ANDROID.PACKAGE-ARCHIVE" = "application/vnd.android.package-archive",
  "VND.OASIS.OPENDOCUMENT.TEXT" = "application/vnd.oasis.opendocument.text",
  "VND.OASIS.OPENDOCUMENT.SPREADSHEET" = "application/vnd.oasis.opendocument.spreadsheet",
  "VND.OASIS.OPENDOCUMENT.PRESENTATION" = "application/vnd.oasis.opendocument.presentation",
  "VND.OASIS.OPENDOCUMENT.GRAPHICS" = "application/vnd.oasis.opendocument.graphics",
  "VND.MS-EXCEL" = "application/vnd.ms-excel",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET" = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "VND.MS-POWERPOINT" = "application/vnd.ms-powerpoint",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.PRESENTATIONML.PRESENTATION" = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "MSWORD" = "application/msword",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "VND.MOZILLA.XUL+XML" = "application/vnd.mozilla.xul+xml"
}
/**
 * @author l.piciollo
 * Tipologica per identificare il tipo di contenuto http che si sta chiedendo
 */
export enum CONTENT_TYPE {
  "TEXT" = "pplication/text",
  "ARRAYBUFFER" = "arraybuffer",
  "BLOB" = "blob",
  "MS_STREAM" = "ms-stream",
  "JAVA-ARCHIVE" = "application/java-archive",
  "EDI-X12" = "application/EDI-X12",
  "EDIFACT" = "application/EDIFACT",
  "JAVASCRIPT" = "application/javascript",
  "OCTET-STREAM" = "application/octet-stream",
  "OGG" = "application/ogg",
  "PDF" = "application/pdf",
  "XHTML+XML" = "application/xhtml+xml",
  "X-SHOCKWAVE-FLASH" = "application/x-shockwave-flash",
  "JSON" = "application/json",
  "LD+JSON" = "application/ld+json",
  "XML" = "application/xml",
  "ZIP" = "application/zip",
  "X-WWW-FORM-URLENCODED" = "application/x-www-form-urlencoded",
  "MPEG" = "audio/mpeg",
  "X-MS-WMA" = "audio/x-ms-wma",
  "VND.RN-REALAUDIO" = "audio/vnd.rn-realaudio",
  "X-WAV" = "audio/x-wav",
  "GIF" = "image/gif",
  "JPEG" = "image/jpeg",
  "PNG" = "image/png",
  "TIFF" = "image/tiff",
  "VND.MICROSOFT.ICON" = "image/vnd.microsoft.icon",
  "X-ICON" = "image/x-icon",
  "VND.DJVU" = "image/vnd.djvu",
  "SVG+XML" = "image/svg+xml",
  "MIXED" = "multipart/mixed",
  "ALTERNATIVE" = "multipart/alternative",
  "RELATED" = "multipart/related",
  "FORM-DATA" = "multipart/form-data; boundary=something",
  "CSS" = "text/css",
  "CSV" = "text/csv",
  "HTML" = "text/html",
  "PLAIN" = "text/plain",
  "MP4" = "video/mp4",
  "QUICKTIME" = "video/quicktime",
  "X-MS-WMV" = "video/x-ms-wmv",
  "X-MSVIDEO" = "video/x-msvideo",
  "X-FLV" = "video/x-flv",
  "WEBM" = "video/webm",
  "VND.ANDROID.PACKAGE-ARCHIVE" = "application/vnd.android.package-archive",
  "VND.OASIS.OPENDOCUMENT.TEXT" = "application/vnd.oasis.opendocument.text",
  "VND.OASIS.OPENDOCUMENT.SPREADSHEET" = "application/vnd.oasis.opendocument.spreadsheet",
  "VND.OASIS.OPENDOCUMENT.PRESENTATION" = "application/vnd.oasis.opendocument.presentation",
  "VND.OASIS.OPENDOCUMENT.GRAPHICS" = "application/vnd.oasis.opendocument.graphics",
  "VND.MS-EXCEL" = "application/vnd.ms-excel",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET" = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "VND.MS-POWERPOINT" = "application/vnd.ms-powerpoint",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.PRESENTATIONML.PRESENTATION" = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "MSWORD" = "application/msword",
  "VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "VND.MOZILLA.XUL+XML" = "application/vnd.mozilla.xul+xml"
}

/**
 * @author l.piciollo
 * Servizio di utilita per chiamate a servizi di BE, espone funzionalità per invocazione al BE
 * funzionalità di download, upload con chiamate asincrone e in background. i servizi espongono tutti un id identificativo
 * per reperire lo stato di proressione di un deterinato avanzamento di richiesta..
 */

@Injectable({
  providedIn: 'root'
})
export class PlHttpService {


  /**@ignore */
  public requestOption(params: JSON, header: HttpHeaders, responseType?: RESPONSE_TYPE, contentType?: CONTENT_TYPE | string) {
    try {
      let search = new HttpParams();
      params != null ? null : params = JSON.parse("{}");
      Object.keys(params).forEach(element => {
        search = search.append(element, params[element]);
      });
      if (header == null) header = new HttpHeaders();

      if (contentType)
        header.append('Content-Type', contentType);
      else
        header.delete('Content-Type')

      let options = { headers: header, params: search };
      if (responseType) {
        options["observe"] = "events";
        options["responseType"] = responseType;
        options["reportProgress"] = true;
      }
      return options;
    } catch (error) {
      throw error
    }
  }
  //***************************************************************************************************** */

  private refreshProgress(uuid: string, event?: HttpProgressEvent | any): Subject<any> {
    try {
      if (uuid != null && event != null) {
        PlCoreUtils.progressBars[uuid].changed.next(PlCoreUtils.progressBars[uuid]);
        PlCoreUtils.progressBars[uuid].byte = event.loaded;
        PlCoreUtils.progressBars[uuid].totalbyte = event.total;
        PlCoreUtils.progressBars[uuid].percent = Math.round(100 * event.loaded / (event.total || event.loaded));
        PlCoreUtils.progressBars[uuid].loaded = (event.loaded / 1024 / 1000).toFixed(3) + "MB";
        PlCoreUtils.progressBars[uuid].size = ((event.total || event.loaded) / 1024 / 1000).toFixed(3) + "MB";
      }
      return PlCoreUtils.progressBars[uuid].changed;
    } catch (error) {
      throw error
    }
  }
  //***************************************************************************************************** */
  private checkEventHttp<T>(event: any, uuid, observer: Subscriber<T>) {
    let httpEventType = null;
    try {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.DownloadProgress:
          if (httpEventType == null) httpEventType = HttpEventType.DownloadProgress;
          if (httpEventType != HttpEventType.DownloadProgress) break;
          this.refreshProgress(uuid, event);
          break;
        case HttpEventType.UploadProgress:
          if (httpEventType == null) httpEventType = HttpEventType.UploadProgress;
          if (httpEventType != HttpEventType.UploadProgress) break;
          this.refreshProgress(uuid, event);
          break;
        case HttpEventType.Response:
          this.refreshProgress(uuid).complete();
          observer.next(event)
          observer.complete();
          break;
        default: {
          observer.next(event)
          observer.complete();
        }
      }
    } catch (e) {
      observer.next(event)
      observer.complete();
    }
  }

  /********************************************************************************************************************/
  constructor(private http: HttpClient) {

  }
  /********************************************************************************************************************/


  /**
     * l.piciollo
     * funzione per il download dello straming in formato file, viene prototipato in ambientService
   * @param streamData
   * @param nomeFile
   * @param isTextfile
   * @param applicationType
   */
  CREATEBLOB(streamData: ArrayBuffer, applicationType: CONTENT_TYPE = CONTENT_TYPE.PDF): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let jsEscape = "\uFEFF";
        let blob = null;
        applicationType == CONTENT_TYPE.TEXT ? blob = new Blob([jsEscape + streamData], { type: applicationType }) : blob = new Blob([streamData], { type: applicationType });
        resolve(window.URL.createObjectURL(blob));
      } catch (error) {
        reject(error);
      }
    });
  };

  //***************************************************************************************************** */

  /**
   * @author l.piciollo
   * eliminazione del blod in memoria
   * @param blobUrl
   */
  DESTROYBLOB(blobUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        URL.revokeObjectURL(blobUrl);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  //***************************************************************************************************** */

  /**
   * l.piciollo
   * funzione per il download dello straming in formato file, viene prototipato in ambientService
   * @param streamData array buffer
   * @param contentType tipo di contenuto
   * @param filename : nome file
   */
  DOWNLOAD(streamData: ArrayBuffer, contentType: CONTENT_TYPE | string, fileName?: string): Promise<any> { return null };

  //***************************************************************************************************** */

  /**
   * l.piciollo
   * si occupa di effettuare il download di un file contenuta nel blob creato con le altre funzionalità
   * funzionalità utilizzabile in combinazione con le funzione di creazione image o file
   * è possibile effettuare anche il download di un file in rete, passando il link al file
   * @param url : url del blob
   * @param filename : nome file
   */
  DOWNLOADURL(url: string, filename: string = "download_temp") {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = url;
      link.download = filename;
      link.click();
      this.revokeURL(url)
    } else {
      window.open(url);
    }
  }
  //***************************************************************************************************** */
  /**@ignore */
  private revokeURL(url) {
    try { URL.revokeObjectURL(url) } catch (e) { };
  };

  /********************************************************************************************************************/


  nativeHttp(plHttpRequest: PlHttpRequest, responseType?: XMLHttpRequestResponseType, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<any> {

    let uuid = UUID.UUID();

    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);

    return new Observable<any>(observer => {
      const xhr = new XMLHttpRequest();

      interrupt == null ? interrupt = new Subject<boolean>() : null;

      interrupt.subscribe(() => {
        xhr.abort();
      })

      PlCoreUtils.progressBars[uuid].interrupt.subscribe(() => {
        xhr.abort();
      })

      PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
      if ('POST|GET|PATCH|DELETE|PUT'.split("|").indexOf(plHttpRequest.method) < -1) {
        observer.error("Method not valid : POST|GET|PATCH|DELETE|PUT")
      }

      let url = new URL(plHttpRequest.url);

      if (plHttpRequest.queryParams != null) Object.keys(plHttpRequest.queryParams).forEach(val => { url.searchParams.set(val, plHttpRequest.queryParams[val]); })
      xhr.open(plHttpRequest.method, decodeURIComponent(url.toString()).replace(/\*/g, "%2A"));
      if (plHttpRequest.httpHeaders != null) Object.keys(plHttpRequest.httpHeaders).forEach(val => { xhr.setRequestHeader(val, plHttpRequest.httpHeaders[val]); })
      if (responseType != null) xhr.responseType = responseType;
      if (contentType != null) xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable)
          this.refreshProgress(uuid, event);
      };

      xhr.onload = () => {
        if (xhr.status != 200) {
          observer.error(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
          of(xhr.response).subscribe(val => {
            observer.next(val);
            observer.complete();
            setTimeout(() => {
              delete PlCoreUtils.progressBars[uuid];
            }, 3000);
          })
        }
      };
      xhr.onerror = (e) => {
        this.refreshProgress(uuid).complete();
        observer.error(e);
      };

      if (plHttpRequest.body instanceof FormData)
        xhr.send(plHttpRequest.body);
      else
        xhr.send(typeof plHttpRequest.body == "string" ? plHttpRequest.body : JSON.stringify(plHttpRequest.body));
    })

  }

  /**
   * @author l.piciollo
   * servizio GET per il caricamento di dati, sia in JSON che file specificando il contentType
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param responseType  tipo di risposta attessa (RESPONSE_TYPE|String|null)
   * @param interrupt     interrupt di servizio aggiuntivo, per killare i processi di chiamata (Subject|null)
   * @param contentType   tipo di contentuto inviato al BE (CONTENT_TYPE|String|null)
   * @param callBack      callback per ricavare l'instanza della request creata, utile per risalire ai progressi della request inplCoreUtilsLibraryService.progressBars

   */
  GET<T>(plHttpRequest: PlHttpRequest, responseType?: RESPONSE_TYPE, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<HttpResponse<T>> {


    let uuid = UUID.UUID();

    responseType == null ? responseType = RESPONSE_TYPE.JSON : null;
    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);
    return new Observable<any>(observer => {
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        let header = plHttpRequest.httpHeaders || new HttpHeaders();
        plHttpRequest.mocked ? header = header.append('mocked', "true") : null;
        const options = this.requestOption(plHttpRequest.queryParams, header, responseType, contentType);
        PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
        let sub = this.http.get<T>(decodeURIComponent(plHttpRequest.url).replace(/\*/g, "%2A"), options)
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
            finalize(() => {
              this.refreshProgress(uuid).complete();
              setTimeout(() => {
                delete PlCoreUtils.progressBars[uuid];
                PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
              }, 3000);
            })
          )
          .subscribe((event: any) => {
            this.checkEventHttp(event, uuid, observer);
          }, err => {
            this.refreshProgress(uuid).complete();
            observer.error(err);
          }
          // , () => {
          //   this.refreshProgress(uuid).complete();
          //   setTimeout(() => {
          //     delete PlCoreUtils.progressBars[uuid];
          //   }, 3000);
          // }
        );
      } catch (error) {
        console.error(error)
        throw error
      }
    });
  }
  /************************************************************************************************ */

  /**
   * @author l.piciollo
   * servizio POST per il caricamento di dati, sia in JSON che file specificando il contentType
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param responseType  tipo di risposta attessa (RESPONSE_TYPE|String|null)
   * @param interrupt     interrupt di servizio aggiuntivo, per killare i processi di chiamata (Subject|null)
   * @param contentType   tipo di contentuto inviato al BE (CONTENT_TYPE|String|null)
   * @param callBack      callback per ricavare l'instanza della request creata, utile per risalire ai progressi della request inplCoreUtilsLibraryService.progressBars

   */
  POST<T>(plHttpRequest: PlHttpRequest, responseType?: RESPONSE_TYPE, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<HttpResponse<T>> {
    let uuid = UUID.UUID();

    responseType == null ? responseType = RESPONSE_TYPE.JSON : null;
    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);
    return new Observable<any>(observer => {
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        let header = plHttpRequest.httpHeaders || new HttpHeaders();
        plHttpRequest.mocked ? header = header.append('mocked', "true") : null;
        const options = this.requestOption(plHttpRequest.queryParams, header, responseType, contentType);
        PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
        let sub = this.http.post<T>(plHttpRequest.url, plHttpRequest.body, options)
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
                        finalize(() => {
              this.refreshProgress(uuid).complete();
              setTimeout(() => {
                delete PlCoreUtils.progressBars[uuid];
                PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
              }, 3000);
            })
          )
          .subscribe((event: any) => {
            this.checkEventHttp(event, uuid, observer);
          }, err => {
            this.refreshProgress(uuid).complete();
            setTimeout(() => {
              delete PlCoreUtils.progressBars[uuid];
            }, 3000);
            observer.error(err);
          }, 
          // () => {
          //   this.refreshProgress(uuid).complete();
          //   setTimeout(() => {
          //     delete PlCoreUtils.progressBars[uuid];
          //   }, 3000);
          // }
        );
      } catch (error) {
        throw error
      }
    });
  }

  /************************************************************************************************ */


  /**
   * @author l.piciollo
   * servizio PATCH per il caricamento di dati, sia in JSON che file specificando il contentType
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param responseType  tipo di risposta attessa (RESPONSE_TYPE|String|null)
   * @param interrupt     interrupt di servizio aggiuntivo, per killare i processi di chiamata (Subject|null)
   * @param contentType   tipo di contentuto inviato al BE (CONTENT_TYPE|String|null)
   * @param callBack      callback per ricavare l'instanza della request creata, utile per risalire ai progressi della request inplCoreUtilsLibraryService.progressBars

   */
  PATCH<T>(plHttpRequest: PlHttpRequest, responseType?: RESPONSE_TYPE, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<HttpResponse<T>> {
    let uuid = UUID.UUID();

    responseType == null ? responseType = RESPONSE_TYPE.JSON : null;
    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);
    return new Observable<any>(observer => {
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        let header = plHttpRequest.httpHeaders || new HttpHeaders();
        plHttpRequest.mocked ? header = header.append('mocked', "true") : null;
        const options = this.requestOption(plHttpRequest.queryParams, header, responseType, contentType);
        PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
        let sub = this.http.patch<T>(plHttpRequest.url, plHttpRequest.body, options)
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
                        finalize(() => {
              this.refreshProgress(uuid).complete();
              setTimeout(() => {
                delete PlCoreUtils.progressBars[uuid];
                PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
              }, 3000);
            })
          )
          .subscribe((event: any) => {
            this.checkEventHttp(event, uuid, observer);
          }, err => {
            this.refreshProgress(uuid).complete();
            setTimeout(() => {
              delete PlCoreUtils.progressBars[uuid];
            }, 3000);
            observer.error(err);
          }
          // , () => {
          //   this.refreshProgress(uuid).complete();
          //   setTimeout(() => {
          //     delete PlCoreUtils.progressBars[uuid];
          //   }, 3000);
          // }
        );
      } catch (error) {
        throw error
      }
    });
  }

  /************************************************************************************************ */


  /**
   * @author l.piciollo
   * servizio PUT per il caricamento di dati, sia in JSON che file specificando il contentType
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param responseType  tipo di risposta attessa (RESPONSE_TYPE|String|null)
   * @param interrupt     interrupt di servizio aggiuntivo, per killare i processi di chiamata (Subject|null)
   * @param contentType   tipo di contentuto inviato al BE (CONTENT_TYPE|String|null)
   * @param callBack      callback per ricavare l'instanza della request creata, utile per risalire ai progressi della request inplCoreUtilsLibraryService.progressBars

   */
  PUT<T>(plHttpRequest: PlHttpRequest, responseType?: RESPONSE_TYPE, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<HttpResponse<T>> {
    let uuid = UUID.UUID();

    responseType == null ? responseType = RESPONSE_TYPE.JSON : null;
    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);
    return new Observable<any>(observer => {
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        let header = plHttpRequest.httpHeaders || new HttpHeaders();
        plHttpRequest.mocked ? header = header.append('mocked', "true") : null;
        const options = this.requestOption(plHttpRequest.queryParams, header, responseType, contentType);
        PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
        let sub = this.http.put<T>(plHttpRequest.url, plHttpRequest.body, options)
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
                        finalize(() => {
              this.refreshProgress(uuid).complete();
              setTimeout(() => {
                delete PlCoreUtils.progressBars[uuid];
                PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
              }, 3000);
            })
          )
          .subscribe((event: any) => {
            this.checkEventHttp(event, uuid, observer);
          }, err => {
            this.refreshProgress(uuid).complete();
            setTimeout(() => {
              delete PlCoreUtils.progressBars[uuid];
            }, 3000);
            observer.error(err);
          }
          // , () => {
          //   this.refreshProgress(uuid).complete();
          //   setTimeout(() => {
          //     delete PlCoreUtils.progressBars[uuid];
          //   }, 3000);
          // }
        );
      } catch (error) {
        throw error
      }
    });
  }

  /********************************************************************************************************************/

  /**
   * @author l.piciollo
   * servizio DELETE per il caricamento di dati, sia in JSON che file specificando il contentType
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param responseType  tipo di risposta attessa (RESPONSE_TYPE|String|null)
   * @param interrupt     interrupt di servizio aggiuntivo, per killare i processi di chiamata (Subject|null)
   * @param contentType   tipo di contentuto inviato al BE (CONTENT_TYPE|String|null)
   * @param callBack      callback per ricavare l'instanza della request creata, utile per risalire ai progressi della request inplCoreUtilsLibraryService.progressBars

   */
  DELETE<T>(plHttpRequest: PlHttpRequest, responseType?: RESPONSE_TYPE, interrupt?: Subject<boolean>, contentType?: CONTENT_TYPE | string, callBack?: (id: string) => void): Observable<HttpResponse<T>> {
    let uuid = UUID.UUID();

    responseType == null ? responseType = RESPONSE_TYPE.JSON : null;
    PlCoreUtils.progressBars[uuid] = { uuid: uuid, totalbyte: 0, byte: 0, changed: new Subject<any>(), blocked: false, url: "", loaded: "0", speed: 0, percent: 0, size: "0", interrupt: new Subject<boolean>() };
    if (callBack) callBack(uuid);
    return new Observable<any>(observer => {
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        let header = plHttpRequest.httpHeaders || new HttpHeaders();
        plHttpRequest.mocked ? header = header.append('mocked', "true") : null;
        const options = this.requestOption(plHttpRequest.queryParams, header, responseType, contentType);
        PlCoreUtils.progressBars[uuid]["url"] = plHttpRequest.url;
        let sub = this.http.delete<T>(decodeURIComponent(plHttpRequest.url).replace(/\*/g, "%2A"), options)
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
                        finalize(() => {
              this.refreshProgress(uuid).complete();
              setTimeout(() => {
                delete PlCoreUtils.progressBars[uuid];
                PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
              }, 3000);
            })
          )
          .subscribe((event: any) => {
            this.checkEventHttp(event, uuid, observer);
          }, err => {
            this.refreshProgress(uuid).complete();
            setTimeout(() => {
              delete PlCoreUtils.progressBars[uuid];
            }, 3000);
            observer.error(err);
          }
          // , () => {
          //   this.refreshProgress(uuid).complete();
          //   setTimeout(() => {
          //     delete PlCoreUtils.progressBars[uuid];
          //   }, 3000);
          // }
        );
      } catch (error) {
        throw error
      }
    });
  }

  /********************************************************************************************************************/
  /**
   * @author l.piciollo
   * applica la chiamata in modalità delete alle api del BE
   * @param plHttpRequest  oggetto contenente parametri da passare al servizio di chiamata alla rete
   * @param mocked     impostato a true, indica che il servizio è sotto mock
   * @return promise
   */
  FORKJOIN(plHttpRequest: Array<PlHttpRequest>, interrupt?: Subject<boolean>): Observable<Array<HttpResponse<any>>> {
    return new Observable<Array<HttpResponse<any>>>(observer => {
      const serviceRequests = [];
      plHttpRequest.forEach(plHttpRequestObj => {
        serviceRequests.push(this.GET(plHttpRequestObj, null, interrupt, null, null));
      });
      try {
        interrupt == null ? interrupt = new Subject<boolean>() : null;
        forkJoin(serviceRequests)
          .pipe(takeUntil(interrupt))
          .subscribe(res => {
            observer.next(<Array<HttpResponse<any>>>res);
            observer.complete();
          }, err => {
            observer.error(err);
          }, () => {
          });
      } catch (error) {
        throw error
      }
    })
  }
  /********************************************************************************************************************/

}
