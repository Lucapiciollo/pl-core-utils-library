import { Injectable } from '@angular/core';

/**
 * @author l.piciollo
 * Servizio di utilita per funzionalita di rete
 */
@Injectable({
  providedIn: 'root'
})
export class PlNetworkService {

  constructor() { }
  /****************************************************************************************** */
  /**
   * @author l.piciollo
   * ritorna i parametri di HEADER della sessione corrente.. location. host che ospita il portale
   */
  public getLocalHttpHeaders(): Promise<Object> {
    var req = new XMLHttpRequest();
    req.open('GET', <any>document.location, false);
    req.send(null);
    var headers = this.parseHttpHeaders(req.getAllResponseHeaders());
    return new Promise<Object>((response, error) => {
      try {
        var s1 = location.search.substring(1, location.search.length).split('&'), r = {}, s2, i;
        s1.forEach(element => {
          s2 = element.split('=');
          r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
        })
        response({ headers: headers, params: r });
      } catch (e) {
        error(e);
      }
    })
  };

/****************************************************************************************** */
  /**@ignore */
  private parseHttpHeaders(httpHeaders) {
    return httpHeaders.split("\n")
      .map(x => x.split(/: */, 2))
      .filter(x => x[0])
      .reduce((ac, x) => { ac[x[0]] = x[1]; return ac; }, {});
  }
}
