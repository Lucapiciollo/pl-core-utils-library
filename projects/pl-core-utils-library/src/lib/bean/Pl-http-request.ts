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

  /**
   * Crea una richiesta HTTP tipizzata.
   * @param data Configurazione iniziale della richiesta.
   */
  constructor(data: PlHttpRequestConfig = {}) {
    this.url = data.url ?? '';
    this.method = PlHttpRequest.normalizeMethod(data.method);
    this.body = data.body;
    this.queryParams = data.queryParams ?? null;
    this.httpHeaders = data.httpHeaders ?? null;
    this.mocked = data.mocked ?? false;
  }

  /**
   * Factory per richiesta GET.
   * @param config Configurazione della richiesta senza metodo.
   * @returns Nuova istanza `PlHttpRequest` con metodo `GET`.
   */
  static get(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'GET'
    });
  }

  /**
   * Factory per richiesta POST.
   * @param config Configurazione della richiesta senza metodo.
   * @returns Nuova istanza `PlHttpRequest` con metodo `POST`.
   */
  static post(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'POST'
    });
  }

  /**
   * Factory per richiesta PATCH.
   * @param config Configurazione della richiesta senza metodo.
   * @returns Nuova istanza `PlHttpRequest` con metodo `PATCH`.
   */
  static patch(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'PATCH'
    });
  }

  /**
   * Factory per richiesta PUT.
   * @param config Configurazione della richiesta senza metodo.
   * @returns Nuova istanza `PlHttpRequest` con metodo `PUT`.
   */
  static put(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'PUT'
    });
  }

  /**
   * Factory per richiesta DELETE.
   * @param config Configurazione della richiesta senza metodo.
   * @returns Nuova istanza `PlHttpRequest` con metodo `DELETE`.
   */
  static delete(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest {
    return new PlHttpRequest({
      ...config,
      method: 'DELETE'
    });
  }

  /**
   * Normalizza e valida il metodo HTTP.
   * @param method Metodo HTTP in ingresso.
   * @returns Metodo HTTP valido; fallback a `GET` se non valido.
   */
  static normalizeMethod(method?: PlHttpMethod | string): PlHttpMethod {
    const normalizedMethod = String(method ?? 'GET').trim().toUpperCase();

    if (PlHttpRequest.isValidMethod(normalizedMethod)) {
      return normalizedMethod;
    }

    return 'GET';
  }

  /**
   * Verifica se il metodo passato è supportato.
   * @param method Metodo da validare.
   * @returns `true` se il metodo è valido.
   */
  static isValidMethod(method: string): method is PlHttpMethod {
    return ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
  }

  /**
   * Clona la richiesta sovrascrivendo i campi specificati.
   * @param config Proprietà da sovrascrivere nella clone.
   * @returns Nuova istanza `PlHttpRequest`.
   */
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

  /**
   * Restituisce una clone con header aggiornati.
   * @param httpHeaders Header HTTP da impostare.
   * @returns Nuova istanza `PlHttpRequest`.
   */
  withHeaders(httpHeaders: HttpHeaders | Record<string, any> | null): PlHttpRequest {
    return this.clone({
      httpHeaders
    });
  }

  /**
   * Restituisce una clone con query params aggiornati.
   * @param queryParams Query params da impostare.
   * @returns Nuova istanza `PlHttpRequest`.
   */
  withQueryParams(queryParams: Record<string, any> | null): PlHttpRequest {
    return this.clone({
      queryParams
    });
  }

  /**
   * Restituisce una clone con body aggiornato.
   * @param body Payload da impostare.
   * @returns Nuova istanza `PlHttpRequest`.
   */
  withBody(body: any): PlHttpRequest {
    return this.clone({
      body
    });
  }

  /**
   * Restituisce una clone con flag mock aggiornato.
   * @param mocked Flag mock da applicare.
   * @returns Nuova istanza `PlHttpRequest`.
   */
  withMocked(mocked = true): PlHttpRequest {
    return this.clone({
      mocked
    });
  }
}