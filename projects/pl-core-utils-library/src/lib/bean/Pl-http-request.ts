import { HttpHeaders } from '@angular/common/http';

export type PlHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface PlHttpRequestConfig {
  url?: string;
  method?: PlHttpMethod | string;
  body?: any;
  queryParams?: Record<string, any> | null;
  httpHeaders?: HttpHeaders | Record<string, any> | null;
  mocked?: boolean;
}

/**
 * Modello richiesta HTTP usato da PlHttpService.
 */
export class PlHttpRequest {
  url: string;
  method: PlHttpMethod;
  body?: any;
  queryParams?: Record<string, any> | null;
  httpHeaders?: HttpHeaders | Record<string, any> | null;
  mocked?: boolean;

  constructor(data: PlHttpRequestConfig = {}) {
    this.url = data.url ?? '';
    this.method = PlHttpRequest.normalizeMethod(data.method);
    this.body = data.body;
    this.queryParams = data.queryParams ?? null;
    this.httpHeaders = data.httpHeaders ?? null;
    this.mocked = data.mocked ?? false;
  }

  static get(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'GET'
    });
  }

  static post(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'POST'
    });
  }

  static patch(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'PATCH'
    });
  }

  static put(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'PUT'
    });
  }

  static delete(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'DELETE'
    });
  }

  static normalizeMethod(method?: PlHttpMethod | string): PlHttpMethod {
    const normalizedMethod = String(method ?? 'GET').trim().toUpperCase();

    if (PlHttpRequest.isValidMethod(normalizedMethod)) {
      return normalizedMethod;
    }

    return 'GET';
  }

  static isValidMethod(method: string): method is PlHttpMethod {
    return ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
  }

  clone(config: PlHttpRequestConfig = {}): PlHttpRequest {
    return new PlHttpRequest({
      url: config.url ?? this.url,
      method: config.method ?? this.method,
      body: config.body ?? this.body,
      queryParams: config.queryParams ?? this.queryParams,
      httpHeaders: config.httpHeaders ?? this.httpHeaders,
      mocked: config.mocked ?? this.mocked
    });
  }

  withHeaders(httpHeaders: HttpHeaders | Record<string, any> | null): PlHttpRequest {
    return this.clone({
      httpHeaders
    });
  }

  withQueryParams(queryParams: Record<string, any> | null): PlHttpRequest {
    return this.clone({
      queryParams
    });
  }

  withBody(body: any): PlHttpRequest {
    return this.clone({
      body
    });
  }

  withMocked(mocked = true): PlHttpRequest {
    return this.clone({
      mocked
    });
  }
}