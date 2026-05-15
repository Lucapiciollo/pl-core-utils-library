import { Injectable } from '@angular/core';

export interface PlLocalHttpInfo {
  headers: Record<string, string>;
  params: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class PlNetworkService {
  constructor() {}

  /**
   * Ritorna gli header della richiesta corrente e i query params della URL.
   *
   * Nota:
   * la lettura degli header tramite XMLHttpRequest sincrona è mantenuta
   * per retrocompatibilità, ma può non funzionare in tutti gli ambienti.
    * @returns Promise con header e query params correnti.
   */
  /**
   * Restituisce headers HTTP e query params della pagina corrente.
   * Utile per debug, diagnostica o per propagare info di contesto lato client.
   * Nota: la lettura degli header tramite XMLHttpRequest sincrona è mantenuta per retrocompatibilità, ma può non funzionare in tutti gli ambienti.
   * @returns Promise con header e query params correnti.
   * @example
   * service.getLocalHttpHeaders().then(({ headers, params }) => console.log(headers, params));
   */
  public getLocalHttpHeaders(): Promise<PlLocalHttpInfo> {
    return new Promise<PlLocalHttpInfo>((resolve, reject) => {
      try {
        if (typeof document === 'undefined' || typeof location === 'undefined') {
          resolve({
            headers: {},
            params: {}
          });
          return;
        }

        const headers = this.readCurrentDocumentHeaders();
        const params = this.parseQueryParams(location.search);

        resolve({
          headers,
          params
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Legge gli header HTTP del documento corrente tramite chiamata locale sincrona.
   * @returns Record con header HTTP della pagina.
   */
  private readCurrentDocumentHeaders(): Record<string, string> {
    try {
      const req = new XMLHttpRequest();

      req.open('GET', document.location.href, false);
      req.send(null);

      return this.parseHttpHeaders(req.getAllResponseHeaders());
    } catch {
      return {};
    }
  }

  /**
   * Effettua il parse dei query param della URL corrente in un record key/value.
   * @param search Stringa query (es: location.search).
   * @returns Record con i parametri query.
   */
  private parseQueryParams(search: string): Record<string, string> {
    const params: Record<string, string> = {};
    const query = search.startsWith('?') ? search.substring(1) : search;

    if (!query) {
      return params;
    }

    query.split('&').forEach(item => {
      if (!item) {
        return;
      }

      const [rawKey, rawValue = ''] = item.split('=');
      const key = decodeURIComponent(rawKey).toLowerCase();
      const value = decodeURIComponent(rawValue);

      params[key] = value;
    });

    return params;
  }

  /**
   * Effettua il parse di una stringa header HTTP in un record key/value.
   * @param httpHeaders Stringa header HTTP (formato raw).
   * @returns Record con header HTTP.
   * @example
   * const headers = service['parseHttpHeaders']('X-Token: abc\nX-Id: 123');
   */
  private parseHttpHeaders(httpHeaders: string): Record<string, string> {
    if (!httpHeaders) {
      return {};
    }

    return httpHeaders
      .split('\n')
      .map(header => header.trim())
      .filter(Boolean)
      .map(header => header.split(/: */, 2))
      .filter(([key]) => !!key)
      .reduce((acc, [key, value]) => {
        acc[key] = value ?? '';
        return acc;
      }, {} as Record<string, string>);
  }
}