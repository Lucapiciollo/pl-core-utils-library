/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-17 23:04:27
 * @modify date 2020-11-17 23:04:27
 * @desc Intercettore HTTP per la gestione delle chiamate mock.
 */

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {
  Inject,
  Injectable,
  InjectionToken,
  Optional
} from '@angular/core';
import { Observable } from 'rxjs';

import { CACHE_TAG } from '../service/pl-cache-map.service';

/**
 * Token per la valorizzazione del path di default
 * usato per risalire ai JSON di mock.
 */
export const DEFAULT_PATH_MOCK = new InjectionToken<string>(
  'Default path for retrieve mock json'
);

@Injectable({
  providedIn: 'root'
})
export class PlHttpInterceptorMockService implements HttpInterceptor {
  constructor(
    @Optional() @Inject(DEFAULT_PATH_MOCK) protected pathMock: string | null,
    @Optional() @Inject(CACHE_TAG) protected tagCache: string | null
  ) {}

  /**
   * Se la request contiene header mocked=true, la chiamata viene trasformata
   * in una GET verso il file JSON corrispondente:
   *
   * /assets/{pathMock}/{url-path}/{method}.json
   *
   * Esempio:
   *
   * GET /api/users con mocked=true
   * diventa:
   * /assets/public/mock/api/users/get.json
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const mocked = request.headers.get('mocked');

    if (mocked?.toLowerCase() !== 'true') {
      return next.handle(request);
    }

    const mockRequest = this.createMockRequest(request);

    return next.handle(mockRequest);
  }

  private createMockRequest(
    request: HttpRequest<unknown>
  ): HttpRequest<unknown> {
    const tagCache = this.tagCache ?? '';
    const cleanUrl = tagCache
      ? request.url.replace(tagCache, '')
      : request.url;

    const parsedUrl = this.createUrl(cleanUrl);
    const pathMock = this.normalizePath(this.pathMock ?? 'public/mock');

    const methodFile = `${request.method.toLowerCase()}.json`;

    let newUrl = [
      '/assets',
      pathMock,
      this.normalizePath(parsedUrl.pathname),
      methodFile
    ]
      .filter(Boolean)
      .join('/');

    if (parsedUrl.search) {
      newUrl = `${newUrl}${parsedUrl.search}`;
    }

    if (tagCache && request.url.includes(tagCache)) {
      newUrl = `${tagCache}${newUrl}`;
    }

    return request.clone({
      method: 'GET',
      url: newUrl,
      headers: request.headers.delete('mocked')
    });
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

  private normalizePath(path: string): string {
    return path
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');
  }
}