/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-22 16:59:27
 * @modify date 2019-12-22 16:59:27
 * @desc [* Classe per la centralizzazione dell'autenticazione utente.. sono predisposti i metodi di login, logaut, risalire allo user e al suo token]
 *
 * Classe per la centralizzazione dell'autenticazione utente.. sono predisposti i metodi di login ,logaut e per risalire allo user
 * autenticato ed al rispettivo token.
 * 
 * ATTENZIONE, NON SI CONSIGLIA LA MODIFICA DI QUESTA CLASSE A CAUSA DI OSSERVATORI ESTERNI CHE NE FANNO USO SPECIFICO.
 * E' POSSIBILE RICHIAMARE I METODI DEL SERVIZIO TRANQUILLAMENTE DA UNA CLASSE DI UTILIY PERSONALE, E GESTIRE IL RISULTATO IN AUTONOMIA
 */
 

import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/com/mycompany/normalize/core/service/http.service';
import { ErrorBean, ErrorCode } from 'src/app/com/mycompany/normalize/core/bean/error-bean';
  
/**
 * @author l.piciollo
 * Classe per la centralizzazione dell'autenticazione utente.. sono predisposti i metodi di login, logaut, risalire allo user e al suo token
 * 
 * Classe per la centralizzazione dell'autenticazione utente.. sono predisposti i metodi di login ,logaut e per risalire allo user
 * autenticato ed al rispettivo token.
 * ATTENZIONE, NON SI CONSIGLIA LA MODIFICA DI QUESTA CLASSE A CAUSA DI OSSERVATORI ESTERNI CHE NE FANNO USO SPECIFICO.
 * E' POSSIBILE RICHIAMARE I METODI DEL SERVIZIO TRANQUILLAMENTE DA UNA CLASSE DI UTILIY PERSONALE, E GESTIRE IL RISULTATO IN AUTONOMIA
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  
    constructor(   private httpService: HttpService, public injector: Injector) {    
    }
  /************************************************************************************************************************* */
  /**
   * @author l.piciollo
   * il metodo viene chimato in autonomia dal sistema core, si registra a degli eventi di intercettazione di azure
   * in caso questo venga attivato.. qul'ora sia abilitato l'autenticatore, e si ha un ko qui, che indica l'utente non è 
   * loggato.. il sistema viene rediretto alla login di azure o altro providere scelto
   */
  public login(): Observable <boolean> {
    
    
      /**
       * @author l.piciollo
       * in caso di login disabilitata, il sistema emula l'utente loggato e da il consenso allo start applicativo
       */
     return new Observable<boolean>(observer => {
      /** 
       * @author l.piciollo 
       * è possibile inseire qui il processo di autenticazione ad un SSO qualsiasi.. 
       * ricevuto l'OK lanciare i due metodi sotto per sbloccare la creazione del portale.. in caso di KO 
       * lanciare :  observer.error() e il portale non si avvia.
       */
      observer.next(true);
      observer.complete()
    });
    
  };
  /************************************************************************************************************************* */
  /**
   * @author l.piciollo
   * funzionalità predisposta per il logout, viene invocato il servizio di azure
   */
  public logout() { 
    try {
      
        console.log("Logout called...")
        
    } catch (error) { 
      throw new ErrorBean(error.message, ErrorCode.SYSTEMERRORCODE, false, true)
    }
  }
  /************************************************************************************************************************* */


}
