/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-17 23:04:27
 * @modify date 2020-11-17 23:04:27
 * @desc Intercettore di chiamata http, viene abilitato in caso di chiamate a servizi mock
 */



import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CACHE_TAG } from '../service/pl-cache-map.service';


/** 
 * @author l.piciollo
 * token per la valorizzazione del path di default per risalire alle classi di mock
 */
export const DEFAULT_PATH_MOCK = new InjectionToken<string>('Defaul path for retrieve mock json');

@Injectable({
  providedIn: 'root'
})
export class PlHttpInterceptorMockService implements HttpInterceptor {

  /***************************************************************************************************************************** */
  constructor(@Inject(DEFAULT_PATH_MOCK) protected pathMock: string,@Inject(CACHE_TAG) protected tagCache: string) {

  }
  /***************************************************************************************************************************** */
  /**
   * @author l.piciollo
   * intercettore per le chiamate di rere.. tutte le chiamate passano da questo intercettore verrà prelevato l'header ed in particolare
   * il parametro 'mocked', se posto a true, allora viene prelevato il json di tipo get||post||patch||delete||put previsto in risposta al
   * servizio
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      if (request.headers.get('mocked') && request.headers.get('mocked').toLowerCase() === "true") {
        const isCacable = request.url.indexOf(this.tagCache) > -1;
        const search = new URL(request.url.replace(this.tagCache,"")).search;
        let newUrl = "/assets/".concat(this.pathMock).concat(new URL(request.url.replace(this.tagCache,"")).pathname).concat("/").concat(request.method.toLowerCase().concat(".json")).concat(search);
        if (isCacable==true) newUrl=this.tagCache.concat(newUrl);
        const httpRequest = new HttpRequest("GET", newUrl);
        request = Object.assign(request, { url: httpRequest.url });
        request = Object.assign(request, { method: httpRequest.method });
      }
      const dupReq = request.clone();
      return next.handle(dupReq);
    } catch (error) {
      throw error
    }
  };
  /***************************************************************************************************************************** */

}
