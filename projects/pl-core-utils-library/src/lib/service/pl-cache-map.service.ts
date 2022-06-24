import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>
  entryTime: number;
}

/**
 * @author l.piciollo
 * token per inizializzare la durata della cache
 * @example { provide: MAX_CACHE_AGE, useValue: 300000 }
 */
export const MAX_CACHE_AGE = new InjectionToken<Number>('DefaulTimeOut for cache');
/**
 * @author l.piciollo
 * token per identificare le chiamate che devono esse messe in cache o meno
 * @example  { provide: CACHE_TAG, useValue: "@cachable@" } 
 */
export const CACHE_TAG = new InjectionToken<String>('tag identificativo per le richieste http');


/**
 * @author l.piciollo
 * servizio di caching per richieste http.. si applica in genere al chiamate get che non subiscono cambiamenti continui da parte del BE
 * anteporre alla url del BE il tag identificatore del cache   @cachable@
 * @example @cachable@/stations/station-type?isSubMenu=1
 */

@Injectable({
  providedIn: 'root'
})
export class PlCacheMapService {
  
  /**@ignore */
  constructor(public injector: Injector) { }
  
  /**@ignore */
  private cacheMap = new Map<string, CacheEntry>();
  
  /**
   * @author l.piciollo
   * funzionalita di storicizzazione della cache. 
   * @param req 
   */
  public get(req: HttpRequest<any>): HttpResponse<any> | null {
    let url = req.url;
    try { url = req.urlWithParams.replace(String(this.injector.get(CACHE_TAG)), '') } catch (e) { }
    const entry = this.cacheMap.get(url);
    if (!entry) {
      return null;
    }    
    const isExpired = (Date.now() - entry.entryTime) > Number(this.injector.get(MAX_CACHE_AGE));
    return isExpired ? null : entry.response;
  }

  /**
   * @author l.piciollo 
   * funzionalità di recupero della cache.
  */
  public put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    let url = req.url;
    try { url = req.urlWithParams.replace(String(this.injector.get(CACHE_TAG)), '') } catch (e) { }
    const entry: CacheEntry = { url: url, response: res, entryTime: Date.now() };
    this.cacheMap.set(url, entry);
    this.deleteExpiredCache();
  }

  /**
   * @ignore
   */
  private deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if ((Date.now() - entry.entryTime) > Number(this.injector.get(MAX_CACHE_AGE))) {
        this.cacheMap.delete(entry.url);
      }
    })
  }
}
