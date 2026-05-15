import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpProgressEvent,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, Subscriber } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { PlHttpMethod, PlHttpRequest } from '../bean/Pl-http-request';
import { PlCoreUtils } from '../pl-core-utils-library.service';
import { createPlUuid } from '../utils/pl-uuid.util';

/** eventi registrati per PLlibrary */
export enum TYPE_EVENT_NETWORK {
  PL_BREACK_NET = 'PL:BREACK_NET'
}

/**
 * Tipologica per identificare il tipo di chiamata http che si sta facendo.
 * Mantiene le chiavi storiche con trattino per retrocompatibilità.
 */
export enum RESPONSE_TYPE {
  'TEXT' = 'application/text',
  'ARRAYBUFFER' = 'arraybuffer',
  'BLOB' = 'blob',
  'MS_STREAM' = 'ms-stream',
  'JAVA-ARCHIVE' = 'application/java-archive',
  'EDI-X12' = 'application/EDI-X12',
  'EDIFACT' = 'application/EDIFACT',
  'JAVASCRIPT' = 'application/javascript',
  'OCTET-STREAM' = 'application/octet-stream',
  'OGG' = 'application/ogg',
  'PDF' = 'application/pdf',
  'XHTML+XML' = 'application/xhtml+xml',
  'X-SHOCKWAVE-FLASH' = 'application/x-shockwave-flash',
  'JSON' = 'application/json',
  'LD+JSON' = 'application/ld+json',
  'XML' = 'application/xml',
  'ZIP' = 'application/zip',
  'X-WWW-FORM-URLENCODED' = 'application/x-www-form-urlencoded',
  'MPEG' = 'audio/mpeg',
  'X-MS-WMA' = 'audio/x-ms-wma',
  'VND.RN-REALAUDIO' = 'audio/vnd.rn-realaudio',
  'X-WAV' = 'audio/x-wav',
  'GIF' = 'image/gif',
  'JPEG' = 'image/jpeg',
  'PNG' = 'image/png',
  'TIFF' = 'image/tiff',
  'VND.MICROSOFT.ICON' = 'image/vnd.microsoft.icon',
  'X-ICON' = 'image/x-icon',
  'VND.DJVU' = 'image/vnd.djvu',
  'SVG+XML' = 'image/svg+xml',
  'MIXED' = 'multipart/mixed',
  'ALTERNATIVE' = 'multipart/alternative',
  'RELATED' = 'multipart/related',
  'FORM-DATA' = 'multipart/form-data; boundary=something',
  'CSS' = 'text/css',
  'CSV' = 'text/csv',
  'HTML' = 'text/html',
  'PLAIN' = 'text/plain',
  'MP4' = 'video/mp4',
  'QUICKTIME' = 'video/quicktime',
  'X-MS-WMV' = 'video/x-ms-wmv',
  'X-MSVIDEO' = 'video/x-msvideo',
  'X-FLV' = 'video/x-flv',
  'WEBM' = 'video/webm',
  'VND.ANDROID.PACKAGE-ARCHIVE' = 'application/vnd.android.package-archive',
  'VND.OASIS.OPENDOCUMENT.TEXT' = 'application/vnd.oasis.opendocument.text',
  'VND.OASIS.OPENDOCUMENT.SPREADSHEET' = 'application/vnd.oasis.opendocument.spreadsheet',
  'VND.OASIS.OPENDOCUMENT.PRESENTATION' = 'application/vnd.oasis.opendocument.presentation',
  'VND.OASIS.OPENDOCUMENT.GRAPHICS' = 'application/vnd.oasis.opendocument.graphics',
  'VND.MS-EXCEL' = 'application/vnd.ms-excel',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'VND.MS-POWERPOINT' = 'application/vnd.ms-powerpoint',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.PRESENTATIONML.PRESENTATION' = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'MSWORD' = 'application/msword',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'VND.MOZILLA.XUL+XML' = 'application/vnd.mozilla.xul+xml'
}

/**
 * Tipologica per identificare il tipo di contenuto http che si sta chiedendo.
 * Mantiene le chiavi storiche con trattino per retrocompatibilità.
 */
export enum CONTENT_TYPE {
  'TEXT' = 'application/text',
  'ARRAYBUFFER' = 'arraybuffer',
  'BLOB' = 'blob',
  'MS_STREAM' = 'ms-stream',
  'JAVA-ARCHIVE' = 'application/java-archive',
  'EDI-X12' = 'application/EDI-X12',
  'EDIFACT' = 'application/EDIFACT',
  'JAVASCRIPT' = 'application/javascript',
  'OCTET-STREAM' = 'application/octet-stream',
  'OGG' = 'application/ogg',
  'PDF' = 'application/pdf',
  'XHTML+XML' = 'application/xhtml+xml',
  'X-SHOCKWAVE-FLASH' = 'application/x-shockwave-flash',
  'JSON' = 'application/json',
  'LD+JSON' = 'application/ld+json',
  'XML' = 'application/xml',
  'ZIP' = 'application/zip',
  'X-WWW-FORM-URLENCODED' = 'application/x-www-form-urlencoded',
  'MPEG' = 'audio/mpeg',
  'X-MS-WMA' = 'audio/x-ms-wma',
  'VND.RN-REALAUDIO' = 'audio/vnd.rn-realaudio',
  'X-WAV' = 'audio/x-wav',
  'GIF' = 'image/gif',
  'JPEG' = 'image/jpeg',
  'PNG' = 'image/png',
  'TIFF' = 'image/tiff',
  'VND.MICROSOFT.ICON' = 'image/vnd.microsoft.icon',
  'X-ICON' = 'image/x-icon',
  'VND.DJVU' = 'image/vnd.djvu',
  'SVG+XML' = 'image/svg+xml',
  'MIXED' = 'multipart/mixed',
  'ALTERNATIVE' = 'multipart/alternative',
  'RELATED' = 'multipart/related',
  'FORM-DATA' = 'multipart/form-data; boundary=something',
  'CSS' = 'text/css',
  'CSV' = 'text/csv',
  'HTML' = 'text/html',
  'PLAIN' = 'text/plain',
  'MP4' = 'video/mp4',
  'QUICKTIME' = 'video/quicktime',
  'X-MS-WMV' = 'video/x-ms-wmv',
  'X-MSVIDEO' = 'video/x-msvideo',
  'X-FLV' = 'video/x-flv',
  'WEBM' = 'video/webm',
  'VND.ANDROID.PACKAGE-ARCHIVE' = 'application/vnd.android.package-archive',
  'VND.OASIS.OPENDOCUMENT.TEXT' = 'application/vnd.oasis.opendocument.text',
  'VND.OASIS.OPENDOCUMENT.SPREADSHEET' = 'application/vnd.oasis.opendocument.spreadsheet',
  'VND.OASIS.OPENDOCUMENT.PRESENTATION' = 'application/vnd.oasis.opendocument.presentation',
  'VND.OASIS.OPENDOCUMENT.GRAPHICS' = 'application/vnd.oasis.opendocument.graphics',
  'VND.MS-EXCEL' = 'application/vnd.ms-excel',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'VND.MS-POWERPOINT' = 'application/vnd.ms-powerpoint',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.PRESENTATIONML.PRESENTATION' = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'MSWORD' = 'application/msword',
  'VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'VND.MOZILLA.XUL+XML' = 'application/vnd.mozilla.xul+xml'
}



@Injectable({
  providedIn: 'root'
})
export class PlHttpService {
  private level = 0;
  private partialItem = '';
  private decoder = new TextDecoder();
  private readonly JTOKEN_START_OBJECT = '{';
  private readonly JTOKEN_END_OBJECT = '}';

  constructor(private http: HttpClient) { }

  /**
   * Converte un oggetto headers generico o HttpHeaders in un oggetto HttpHeaders.
   * @param headers Oggetto headers (HttpHeaders o Record<string, any>).
   * @returns Oggetto HttpHeaders pronto per l’uso nelle chiamate Angular HttpClient.
   * @example
   * const headers = service.toHttpHeaders({ Authorization: 'Bearer token' });
   */
  private toHttpHeaders(headers?: HttpHeaders | Record<string, any> | null): HttpHeaders {
    if (!headers) {
      return new HttpHeaders();
    }

    if (headers instanceof HttpHeaders) {
      return headers;
    }

    let httpHeaders = new HttpHeaders();

    Object.keys(headers).forEach(key => {
      const value = headers[key];

      if (value !== undefined && value !== null) {
        httpHeaders = httpHeaders.set(key, String(value));
      }
    });

    return httpHeaders;
  }

  /**
   * Crea una nuova progress bar associata a una richiesta HTTP.
   * @param uuid Identificativo univoco della progress bar.
   */
  private createProgressBar(uuid: string): void {
    PlCoreUtils.progressBars[uuid] = {
      uuid,
      totalbyte: 0,
      byte: 0,
      changed: new Subject<any>(),
      blocked: false,
      url: '',
      loaded: '0',
      speed: 0,
      percent: 0,
      size: '0',
      interrupt: new Subject<boolean>()
    };
  }

  /**
   * Completa e rimuove la progress bar associata a una richiesta HTTP.
   * @param uuid Identificativo progress bar.
   * @param remove Se true rimuove la progress bar, altrimenti la completa soltanto.
   */
  private completeProgressBar(uuid: string, remove = true): void {
    const progressBar = PlCoreUtils.progressBars[uuid];

    if (!progressBar) {
      return;
    }

    progressBar.changed.complete();
    progressBar.interrupt.complete();

    if (remove) {
      delete PlCoreUtils.progressBars[uuid];
      PlCoreUtils.progressBars = { ...PlCoreUtils.progressBars };
    }
  }

  /**
   * Completa la progress bar con un ritardo opzionale (default 3s).
   * @param uuid Identificativo progress bar.
   * @param delayMs Millisecondi di ritardo prima della rimozione.
   */
  private completeProgressBarDelayed(uuid: string, delayMs = 3000): void {
    this.completeProgressBar(uuid, false);

    setTimeout(() => {
      this.completeProgressBar(uuid, true);
    }, delayMs);
  }

  /** @ignore */
  /**
   * Costruisce le opzioni per una richiesta HTTP Angular (headers, params, responseType, ecc).
   * @param params Parametri query string.
   * @param header Headers HTTP.
   * @param responseType Tipo di risposta atteso.
   * @param contentType Content-Type esplicito.
   * @returns Oggetto opzioni per HttpClient.
   * @example
   * const options = service.requestOption({ id: 1 }, null, RESPONSE_TYPE.JSON, CONTENT_TYPE.JSON);
   */
  public requestOption(
    params: Record<string, any> | null,
    header: HttpHeaders | null,
    responseType?: RESPONSE_TYPE,
    contentType?: CONTENT_TYPE | string
  ): any {
    let search = new HttpParams();
    const safeParams = params ?? {};

    Object.keys(safeParams).forEach(key => {
      const value = safeParams[key];

      if (value !== undefined && value !== null) {
        search = search.append(key, value);
      }
    });

    let headers = header ?? new HttpHeaders();

    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    } else {
      headers = headers.delete('Content-Type');
    }

    const options: any = {
      headers,
      params: search
    };

    if (responseType) {
      options.observe = 'events';
      options.responseType = responseType;
      options.reportProgress = true;
    }

    return options;
  }

  /**
   * Aggiorna lo stato della progress bar associata a una richiesta HTTP.
   * @param uuid Identificativo progress bar.
   * @param event Evento di progresso HTTP.
   * @returns Subject che emette lo stato aggiornato della progress bar.
   */
  private refreshProgress(uuid: string, event?: HttpProgressEvent | any): Subject<any> {
    const progressBar = PlCoreUtils.progressBars[uuid];

    if (!progressBar) {
      return new Subject<any>();
    }

    if (event != null) {
      progressBar.byte = event.loaded ?? 0;
      progressBar.totalbyte = event.total ?? event.loaded ?? 0;
      progressBar.percent = Math.round(100 * (event.loaded ?? 0) / (event.total || event.loaded || 1));
      progressBar.loaded = ((event.loaded ?? 0) / 1024 / 1000).toFixed(3) + 'MB';
      progressBar.size = ((event.total || event.loaded || 0) / 1024 / 1000).toFixed(3) + 'MB';
      progressBar.changed.next(progressBar);
    }

    return progressBar.changed;
  }

  /**
   * Gestisce i vari eventi HTTP (progress, risposta, errore) e aggiorna la progress bar.
   * @param event Evento HTTP.
   * @param uuid Identificativo progress bar.
   * @param observer Observer RxJS per la risposta.
   */
  private checkEventHttp<T>(event: any, uuid: string, observer: Subscriber<T>): void {
    try {
      switch (event.type) {
        case HttpEventType.Sent:
        case HttpEventType.ResponseHeader:
          break;

        case HttpEventType.DownloadProgress:
        case HttpEventType.UploadProgress:
          this.refreshProgress(uuid, event);
          break;

        case HttpEventType.Response:
          observer.next(event);
          observer.complete();
          break;

        default:
          observer.next(event);
          observer.complete();
          break;
      }
    } catch {
      observer.next(event);
      observer.complete();
    }
  }

  /**
   * Normalizza una URL decodificandola e sostituendo i caratteri speciali.
   * @param url URL da normalizzare.
   * @returns URL normalizzata.
   */
  private normalizeUrl(url: string): string {
    return decodeURIComponent(url).replace(/\*/g, '%2A');
  }

  /**
   * Crea una URL con i parametri query forniti.
   * @param url URL base.
   * @param queryParams Parametri query string.
   * @returns URL completa di query string.
   */
  private createUrlWithQueryParams(url: string, queryParams?: Record<string, any> | null): string {
    const parsedUrl = this.createUrl(url);

    if (queryParams != null) {
      Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];

        if (value !== undefined && value !== null) {
          parsedUrl.searchParams.set(key, value);
        }
      });
    }

    return this.normalizeUrl(parsedUrl.toString());
  }

  /**
   * Crea un oggetto URL robusto anche in ambienti non-browser.
   * @param url Stringa URL.
   * @returns Oggetto URL.
   */
  private createUrl(url: string): URL {
    try {
      return new URL(url);
    } catch {
      const baseUrl =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'http://localhost';

      return new URL(url, baseUrl);
    }
  }

  /**
   * Normalizza il metodo HTTP in uno dei valori accettati.
   * @param method Metodo HTTP (stringa).
   * @returns Metodo normalizzato o null se non valido.
   */
  private normalizeMethod(method: any): PlHttpMethod | null {
    const normalizedMethod = String(method ?? '').trim().toUpperCase();

    if (['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(normalizedMethod)) {
      return normalizedMethod as PlHttpMethod;
    }

    return null;
  }

  /**
   * Applica gli header HTTP a una richiesta XMLHttpRequest.
   * @param xhr Oggetto XMLHttpRequest.
   * @param headers Headers da applicare.
   */
  private applyXhrHeaders(xhr: XMLHttpRequest, headers?: HttpHeaders | Record<string, any> | null): void {
    if (!headers) {
      return;
    }

    if (headers instanceof HttpHeaders) {
      headers.keys().forEach(key => {
        const value = headers.get(key);

        if (value !== null) {
          xhr.setRequestHeader(key, value);
        }
      });

      return;
    }

    Object.keys(headers).forEach(key => {
      const value = headers[key];

      if (value !== undefined && value !== null) {
        xhr.setRequestHeader(key, String(value));
      }
    });
  }

  /**
   * Esegue una richiesta HTTP tramite Angular HttpClient con gestione avanzata di progress, interrupt e callback.
   * @param method Metodo HTTP (GET, POST, ecc).
   * @param plHttpRequest Oggetto richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress bar.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.requestWithAngularHttp('GET', new PlHttpRequest({ url: '/api/data' }), RESPONSE_TYPE.JSON)
   *   .subscribe(res => console.log(res));
   */
  private requestWithAngularHttp<T>(
    method: PlHttpMethod,
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    const uuid = createPlUuid();

    responseType = responseType ?? RESPONSE_TYPE.JSON;
    interrupt = interrupt ?? new Subject<boolean>();

    this.createProgressBar(uuid);

    if (callBack) {
      callBack(uuid);
    }

    return new Observable<any>(observer => {
      try {
        let header = this.toHttpHeaders(plHttpRequest.httpHeaders);

        if (plHttpRequest.mocked) {
          header = header.append('mocked', 'true');
        }
        const options = this.requestOption(
          plHttpRequest.queryParams,
          header,
          responseType,
          contentType
        );

        PlCoreUtils.progressBars[uuid].url = plHttpRequest.url;

        const url =
          method === 'GET' || method === 'DELETE'
            ? this.normalizeUrl(plHttpRequest.url)
            : plHttpRequest.url;

        let request$: Observable<any>;

        switch (method) {
          case 'GET':
            request$ = this.http.get<T>(url, options);
            break;

          case 'POST':
            request$ = this.http.post<T>(url, plHttpRequest.body, options);
            break;

          case 'PATCH':
            request$ = this.http.patch<T>(url, plHttpRequest.body, options);
            break;

          case 'PUT':
            request$ = this.http.put<T>(url, plHttpRequest.body, options);
            break;

          case 'DELETE':
            request$ = this.http.delete<T>(url, options);
            break;
        }

        const subscription = request$
          .pipe(
            takeUntil(PlCoreUtils.progressBars[uuid].interrupt),
            takeUntil(interrupt),
            finalize(() => {
              this.completeProgressBarDelayed(uuid);
            })
          )
          .subscribe({
            next: event => {
              this.checkEventHttp(event, uuid, observer);
            },
            error: err => {
              observer.error(err);
            }
          });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        observer.error(error);
        this.completeProgressBarDelayed(uuid);

        return () => { };
      }
    });
  }

  /**
   * Crea un blob URL da uno stream binario.
   * @param streamData Contenuto binario da trasformare in blob.
   * @param applicationType MIME type da associare al blob.
   * @returns Promise con blob URL creato.
   */
  /**
   * Crea un blob URL da uno stream binario (es. per download file).
   * @param streamData Contenuto binario da trasformare in blob.
   * @param applicationType MIME type da associare al blob.
   * @returns Promise con blob URL creato.
   * @example
   * service.CREATEBLOB(arrayBuffer, CONTENT_TYPE.PDF).then(url => ...);
   */
  CREATEBLOB(streamData: ArrayBuffer, applicationType: CONTENT_TYPE | string = CONTENT_TYPE.PDF): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (typeof window === 'undefined' || !window.URL) {
          reject(new Error('CREATEBLOB is available only in browser environments'));
          return;
        }

        const jsEscape = '\uFEFF';

        const blob =
          applicationType === CONTENT_TYPE.TEXT
            ? new Blob([jsEscape + streamData], { type: applicationType })
            : new Blob([streamData], { type: applicationType });

        resolve(window.URL.createObjectURL(blob));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Elimina blob URL dalla memoria.
    * @param blobUrl Blob URL da revocare.
    * @returns Promise `true` se l'operazione completa senza errori.
   */
  /**
   * Elimina un blob URL dalla memoria del browser.
   * @param blobUrl Blob URL da revocare.
   * @returns Promise `true` se l'operazione completa senza errori.
   * @example
   * service.DESTROYBLOB(url).then(() => ...);
   */
  DESTROYBLOB(blobUrl: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.revokeURL(blobUrl);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Effettua il download di uno stream dati come file.
    * @param streamData Dato binario da scaricare.
    * @param contentType Content type del file.
    * @param fileName Nome file di destinazione.
    * @returns Promise `true` a download avviato.
   */
  /**
   * Effettua il download di uno stream dati come file locale.
   * @param streamData Dato binario da scaricare.
   * @param contentType Content type del file.
   * @param fileName Nome file di destinazione.
   * @returns Promise `true` a download avviato.
   * @example
   * service.DOWNLOAD(arrayBuffer, CONTENT_TYPE.PDF, 'file.pdf');
   */
  DOWNLOAD(
    streamData: ArrayBuffer,
    contentType: CONTENT_TYPE | string,
    fileName = 'download_temp'
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.CREATEBLOB(streamData, contentType)
          .then(blobUrl => {
            this.DOWNLOADURL(blobUrl, fileName);
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Download di un file da URL/blob URL.
    * @param url URL o blob URL sorgente.
    * @param filename Nome file di download.
   */
  /**
   * Download di un file da URL/blob URL (browser only).
   * @param url URL o blob URL sorgente.
   * @param filename Nome file di download.
   * @example
   * service.DOWNLOADURL(blobUrl, 'file.pdf');
   */
  DOWNLOADURL(url: string, filename = 'download_temp'): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      throw new Error('DOWNLOADURL is available only in browser environments');
    }

    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.revokeURL(url);
      return;
    }

    window.open(url);
  }

  /** @ignore */
  private revokeURL(url: string): void {
    try {
      if (typeof URL !== 'undefined') {
        URL.revokeObjectURL(url);
      }
    } catch { }
  }



  /**
   * Decodifica incrementale di chunk JSON per streaming.
   * @param value Chunk binario.
   * @param decodedItemCallback Callback per ogni item decodificato.
   */
  private decodeChunk<T>(value: Uint8Array, decodedItemCallback: (item: T) => void): void {
    const chunk = this.decoder.decode(value);
    let itemStart = 0;

    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === this.JTOKEN_START_OBJECT) {
        if (this.level === 0) {
          itemStart = i;
        }

        this.level++;
      }

      if (chunk[i] === this.JTOKEN_END_OBJECT) {
        this.level--;

        if (this.level === 0) {
          let item = chunk.substring(itemStart, i + 1);

          if (this.partialItem) {
            item = this.partialItem + item;
            this.partialItem = '';
          }

          decodedItemCallback(JSON.parse(item));
        }
      }
    }

    if (this.level !== 0) {
      this.partialItem = chunk.substring(itemStart);
    }
  }

  /**
   * Converte headers generici in Record<string, string> per fetch/streaming.
   * @param headers Headers da convertire.
   * @returns Record<string, string>.
   */
  private toHeaderRecord(headers?: HttpHeaders | Record<string, any> | null): Record<string, string> {
    if (!headers) {
      return {};
    }

    if (headers instanceof HttpHeaders) {
      return headers.keys().reduce((acc, key) => {
        const value = headers.get(key);

        if (value !== null) {
          acc[key] = value;
        }

        return acc;
      }, {} as Record<string, string>);
    }

    return Object.keys(headers).reduce((acc, key) => {
      const value = headers[key];

      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }

      return acc;
    }, {} as Record<string, string>);
  }
  /**
   * Esegue una richiesta fetch in streaming e emette gli item decodificati chunk-by-chunk.
   * Se `decodeChunk` non è fornito, usa il decoder JSON incrementale interno.
    * @param plttpRequest Richiesta HTTP da eseguire in streaming.
    * @param interrupt Segnale di abort esterno opzionale.
    * @param decodeChunk Decoder custom opzionale per il chunk.
    * @returns Observable che emette gli item decodificati.
   */
  /**
   * Esegue una richiesta fetch in streaming e emette gli item decodificati chunk-by-chunk.
   * Se `decodeChunk` non è fornito, usa il decoder JSON incrementale interno.
   * @param plttpRequest Richiesta HTTP da eseguire in streaming.
   * @param interrupt Segnale di abort esterno opzionale.
   * @param decodeChunk Decoder custom opzionale per il chunk.
   * @returns Observable che emette gli item decodificati.
   * @example
   * service.STREAM(new PlHttpRequest({ url: '/api/stream' })).subscribe(item => ...);
   */
  STREAM<T>(
    plttpRequest: PlHttpRequest,
    interrupt?: AbortSignal,
    decodeChunk?: (value: Uint8Array, decodedItemCallback: (item: T) => void) => void
  ): Observable<T> {
    return new Observable<T>(observer => {
      const controller = new AbortController();
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
      const url = this.createUrl(plttpRequest.url);

      if (plttpRequest.queryParams != null) {
        Object.keys(plttpRequest.queryParams).forEach(key => {
          const value = plttpRequest.queryParams[key];

          if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
          }
        });
      }

      const headersObj = this.toHeaderRecord(plttpRequest.httpHeaders);

      (async () => {
        try {
          const method = String(plttpRequest.method ?? 'GET').trim().toUpperCase();
          const hasBody = !['GET', 'DELETE'].includes(method);

          const response = await fetch(url.toString(), {
            method,
            headers: { ...(headersObj || {}) },
            body: hasBody && plttpRequest.body ? JSON.stringify(plttpRequest.body) : undefined,
            signal: interrupt ?? controller.signal
          });

          if (!response.ok || !response.body) {
            observer.error(new Error(`HTTP error! status: ${response.status}`));
            return;
          }

          reader = response.body.getReader();

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            if (decodeChunk) {
              decodeChunk(value, item => observer.next(item));
            } else {
              this.decodeChunk<T>(value, item => observer.next(item));
            }
          }

          observer.complete();
        } catch (err) {
          if ((err as any)?.name === 'AbortError') {
            observer.error(new Error('STREAM aborted'));
            return;
          }

          observer.error(err);
        }
      })();

      return () => {
        try {
          controller.abort();
          reader?.cancel();
        } catch { }
      };
    });
  }

  /**
   * Esegue la request con XMLHttpRequest (fallback compatibilità/browser legacy).
   * Supporta interrupt esterno e progressbar interna.
    * @param plHttpRequest Richiesta HTTP da eseguire.
    * @param responseType Tipo risposta XMLHttpRequest.
    * @param interrupt Subject per interrompere la richiesta.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback invocata con id progress bar.
    * @returns Observable con risposta raw XHR.
   */
  /**
   * Esegue la request con XMLHttpRequest (fallback compatibilità/browser legacy).
   * Supporta interrupt esterno e progressbar interna.
   * @param plHttpRequest Richiesta HTTP da eseguire.
   * @param responseType Tipo risposta XMLHttpRequest.
   * @param interrupt Subject per interrompere la richiesta.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback invocata con id progress bar.
   * @returns Observable con risposta raw XHR.
   * @example
   * service.nativeHttp(new PlHttpRequest({ url: '/api/data' }), 'json').subscribe(res => ...);
   */
  nativeHttp(
    plHttpRequest: PlHttpRequest,
    responseType?: XMLHttpRequestResponseType,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<any> {
    const uuid = createPlUuid();

    this.createProgressBar(uuid);

    if (callBack) {
      callBack(uuid);
    }

    return new Observable<any>(observer => {
      const xhr = new XMLHttpRequest();
      const requestInterrupt = interrupt ?? new Subject<boolean>();

      const externalInterruptSub = requestInterrupt.subscribe(() => {
        xhr.abort();
      });

      const progressInterruptSub = PlCoreUtils.progressBars[uuid].interrupt.subscribe(() => {
        xhr.abort();
      });

      PlCoreUtils.progressBars[uuid].url = plHttpRequest.url;

      const method = this.normalizeMethod(plHttpRequest.method);

      if (!method) {
        observer.error('Method not valid : POST|GET|PATCH|DELETE|PUT');
        this.completeProgressBarDelayed(uuid);

        return () => {
          externalInterruptSub.unsubscribe();
          progressInterruptSub.unsubscribe();
        };
      }

      const url = this.createUrlWithQueryParams(plHttpRequest.url, plHttpRequest.queryParams);

      xhr.open(method, url);

      this.applyXhrHeaders(
        xhr,
        plHttpRequest.httpHeaders as HttpHeaders | Record<string, any> | null
      );

      if (responseType != null) {
        xhr.responseType = responseType;
      }

      if (contentType != null) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          this.refreshProgress(uuid, event);
        }
      };

      xhr.onprogress = event => {
        if (event.lengthComputable) {
          this.refreshProgress(uuid, event);
        }
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          observer.error(`Error ${xhr.status}: ${xhr.statusText}`);
          this.completeProgressBarDelayed(uuid);
          return;
        }

        observer.next(xhr.response);
        observer.complete();
        this.completeProgressBarDelayed(uuid);
      };

      xhr.onerror = e => {
        observer.error(e);
        this.completeProgressBarDelayed(uuid);
      };

      xhr.onabort = () => {
        observer.error(new Error('Request aborted'));
        this.completeProgressBarDelayed(uuid);
      };

      if (plHttpRequest.body instanceof FormData) {
        xhr.send(plHttpRequest.body);
      } else {
        xhr.send(
          typeof plHttpRequest.body === 'string'
            ? plHttpRequest.body
            : JSON.stringify(plHttpRequest.body ?? {})
        );
      }

      return () => {
        externalInterruptSub.unsubscribe();
        progressInterruptSub.unsubscribe();

        if (xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.abort();
        }
      };
    });
  }

  /**
   * Servizio GET.
    * @param plHttpRequest Configurazione richiesta.
    * @param responseType Tipo risposta atteso.
    * @param interrupt Subject di interruzione.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback con id progress.
    * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Servizio GET (shortcut per REQUEST con method GET).
   * @param plHttpRequest Configurazione richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.GET(new PlHttpRequest({ url: '/api/data' })).subscribe(res => ...);
   */
  GET<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    return this.REQUEST<T>(
      new PlHttpRequest({
        ...plHttpRequest,
        method: 'GET'
      }),
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }

  /**
   * Servizio POST.
    * @param plHttpRequest Configurazione richiesta.
    * @param responseType Tipo risposta atteso.
    * @param interrupt Subject di interruzione.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback con id progress.
    * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Servizio POST (shortcut per REQUEST con method POST).
   * @param plHttpRequest Configurazione richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.POST(new PlHttpRequest({ url: '/api/data', body: { foo: 'bar' } })).subscribe(res => ...);
   */
  POST<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    return this.REQUEST<T>(
      new PlHttpRequest({
        ...plHttpRequest,
        method: 'POST'
      }),
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }

  /**
   * Servizio PATCH.
    * @param plHttpRequest Configurazione richiesta.
    * @param responseType Tipo risposta atteso.
    * @param interrupt Subject di interruzione.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback con id progress.
    * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Servizio PATCH (shortcut per REQUEST con method PATCH).
   * @param plHttpRequest Configurazione richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.PATCH(new PlHttpRequest({ url: '/api/data', body: { foo: 'bar' } })).subscribe(res => ...);
   */
  PATCH<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    return this.REQUEST<T>(
      new PlHttpRequest({
        ...plHttpRequest,
        method: 'PATCH'
      }),
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }

  /**
   * Servizio PUT.
    * @param plHttpRequest Configurazione richiesta.
    * @param responseType Tipo risposta atteso.
    * @param interrupt Subject di interruzione.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback con id progress.
    * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Servizio PUT (shortcut per REQUEST con method PUT).
   * @param plHttpRequest Configurazione richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.PUT(new PlHttpRequest({ url: '/api/data', body: { foo: 'bar' } })).subscribe(res => ...);
   */
  PUT<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    return this.REQUEST<T>(
      new PlHttpRequest({
        ...plHttpRequest,
        method: 'PUT'
      }),
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }

  /**
   * Servizio DELETE.
    * @param plHttpRequest Configurazione richiesta.
    * @param responseType Tipo risposta atteso.
    * @param interrupt Subject di interruzione.
    * @param contentType Content-Type esplicito.
    * @param callBack Callback con id progress.
    * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Servizio DELETE (shortcut per REQUEST con method DELETE).
   * @param plHttpRequest Configurazione richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.DELETE(new PlHttpRequest({ url: '/api/data' })).subscribe(res => ...);
   */
  DELETE<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    return this.REQUEST<T>(
      new PlHttpRequest({
        ...plHttpRequest,
        method: 'DELETE'
      }),
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }

  /**
   * Esegue più chiamate GET in parallelo e restituisce il risultato aggregato.
   * @param plHttpRequest Lista richieste GET da eseguire.
   * @param interrupt Subject opzionale di interruzione globale.
   * @returns Observable con array di risposte HTTP.
   */
  /**
   * Esegue più chiamate GET in parallelo e restituisce il risultato aggregato.
   * @param plHttpRequest Lista richieste GET da eseguire.
   * @param interrupt Subject opzionale di interruzione globale.
   * @returns Observable con array di risposte HTTP.
   * @example
   * service.FORKJOIN([
   *   new PlHttpRequest({ url: '/api/1' }),
   *   new PlHttpRequest({ url: '/api/2' })
   * ]).subscribe(responses => ...);
   */
  FORKJOIN<T = any>(
    plHttpRequest: Array<PlHttpRequest>,
    interrupt?: Subject<boolean>
  ): Observable<Array<HttpResponse<T>>> {
    return new Observable<Array<HttpResponse<T>>>(observer => {
      const requestInterrupt = interrupt ?? new Subject<boolean>();

      const serviceRequests = plHttpRequest.map(request =>
        this.GET<T>(request, undefined, requestInterrupt, undefined, undefined)
      );

      const subscription = forkJoin(serviceRequests)
        .pipe(takeUntil(requestInterrupt))
        .subscribe({
          next: res => {
            observer.next(res as Array<HttpResponse<T>>);
            observer.complete();
          },
          error: err => {
            observer.error(err);
          }
        });

      return () => {
        subscription.unsubscribe();

        if (!requestInterrupt.closed) {
          requestInterrupt.next(true);
          requestInterrupt.complete();
        }
      };
    });
  }

  /**
   * Metodo generico per eseguire una richiesta HTTP in base al method del `PlHttpRequest`.
   * @param plHttpRequest Configurazione completa richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   */
  /**
   * Metodo generico per eseguire una richiesta HTTP in base al method del `PlHttpRequest`.
   * @param plHttpRequest Configurazione completa richiesta.
   * @param responseType Tipo risposta atteso.
   * @param interrupt Subject di interruzione.
   * @param contentType Content-Type esplicito.
   * @param callBack Callback con id progress.
   * @returns Observable con evento di risposta HTTP.
   * @example
   * service.REQUEST(new PlHttpRequest({ url: '/api/data', method: 'POST', body: { foo: 'bar' } }))
   *   .subscribe(res => ...);
   */
  REQUEST<T>(
    plHttpRequest: PlHttpRequest,
    responseType?: RESPONSE_TYPE,
    interrupt?: Subject<boolean>,
    contentType?: CONTENT_TYPE | string,
    callBack?: (id: string) => void
  ): Observable<HttpResponse<T>> {
    const method = PlHttpRequest.normalizeMethod(plHttpRequest.method);

    return this.requestWithAngularHttp<T>(
      method,
      plHttpRequest,
      responseType,
      interrupt,
      contentType,
      callBack
    );
  }
}