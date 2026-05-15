/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2019-11-06 22:10:04
 * @modify date 2019-11-06 22:10:04
 * @desc Servizio utility per chiamate HTTP, upload/download, stream e progress.
 */

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

  private completeProgressBarDelayed(uuid: string, delayMs = 3000): void {
    this.completeProgressBar(uuid, false);

    setTimeout(() => {
      this.completeProgressBar(uuid, true);
    }, delayMs);
  }

  /** @ignore */
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

  private normalizeUrl(url: string): string {
    return decodeURIComponent(url).replace(/\*/g, '%2A');
  }

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

  private normalizeMethod(method: any): PlHttpMethod | null {
    const normalizedMethod = String(method ?? '').trim().toUpperCase();

    if (['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(normalizedMethod)) {
      return normalizedMethod as PlHttpMethod;
    }

    return null;
  }

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
   * Crea un blob URL da stream dati.
   */
  CREATEBLOB(streamData: ArrayBuffer, applicationType: CONTENT_TYPE = CONTENT_TYPE.PDF): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
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
   */
  DESTROYBLOB(blobUrl: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        URL.revokeObjectURL(blobUrl);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Placeholder storico per download da stream.
   */
  DOWNLOAD(streamData: ArrayBuffer, contentType: CONTENT_TYPE | string, fileName?: string): Promise<any> {
    return Promise.resolve(null);
  }

  /**
   * Download di un file da URL/blob URL.
   */
  DOWNLOADURL(url: string, filename = 'download_temp'): void {
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = url;
      link.download = filename;
      link.click();
      this.revokeURL(url);
      return;
    }

    window.open(url);
  }

  /** @ignore */
  private revokeURL(url: string): void {
    try {
      URL.revokeObjectURL(url);
    } catch { }
  }

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
   * Esegue più GET in parallelo.
   */
  FORKJOIN<T = any>(
    plHttpRequest: Array<PlHttpRequest>,
    interrupt?: Subject<boolean>
  ): Observable<Array<HttpResponse<T>>> {
    const requestInterrupt = interrupt ?? new Subject<boolean>();

    const serviceRequests = plHttpRequest.map(request =>
      this.GET<T>(request, undefined, requestInterrupt, undefined, undefined)
    );

    return forkJoin(serviceRequests).pipe(
      takeUntil(requestInterrupt)
    );
  }

  /**
 * Metodo generico per eseguire una richiesta HTTP.
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