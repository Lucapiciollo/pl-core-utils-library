import { DatePipe, registerLocaleData } from '@angular/common';
import localeIT from '@angular/common/locales/it';
import { PlCoreUtils } from '../pl-core-utils-library.service';
import { Observable, Subscription } from 'rxjs';
/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2019-11-30 12:16:54
 * @modify date 2019-11-30 12:16:54
 * @desc [description]
 */

/** eventi registrati per PLlibrary */
export enum TYPE_EVENT {
  PL_SET_PERMISSION = "PL:SET-PERMISSION"
}
  
 
/**
 * @author l.piciollo
 * decoratore di metodo, traccia in console l'esecuzione di una funzione, loggango argomenti passati e risposta ricevuta
 */
export function PLTraceMethod() {
  return function (target, key, descriptor) {
    return {
      value: function (...args: any[]) {
        try {
          console.debug(`%c PLTraceMethod -  Class:   ${target.constructor.name} TRACE FUNCTION: ${key} INPUT`, `color: green `,  args);
          var result = descriptor.value.apply(this, arguments);
          console.debug(`%c PLTraceMethod -  Class:   ${target.constructor.name} TRACE FUNCTION: ${key} OUTPUT`, `color: green `, result || "");
          return result;
        } catch (error) {
          console.error(`%c PLTraceMethod -  Class:  ${target.constructor.name}  TRACE FUNCTION: ${key} ERROR: `, `color: red `, error || "");
        }
      }
    }
   
  };
}
 
  
/**********************************************************************************************************************
/**
 * @author l.piciollo
 * decoratore di classe,abilita il log trace dei cicli di hook del componente. viene loggata ogni invocazione dei ogni ciclo
 * @param disabled: Array<string> cicli kook da non tracciare nei log 
 */
export function PLTraceHooks(disabled: Array<string> = []): ClassDecorator {
  return function (constructor: any) {
    console.debug(`%c PLTraceHooks -  Class:  ${constructor.name}  ENABLED TRACE HOOKS`, `color: green `);
    const LIFECYCLE_HOOKS = [
      'ngOnChanges', 'ngOnInit', 'ngDoCheck', 'ngAfterContentInit', 'ngAfterContentChecked', 'ngAfterViewInit', 'ngAfterViewChecked', 'ngOnDestroy'
    ];
    ///@ts-ignore
    let LIFECYCLE_HOOKS_APP = LIFECYCLE_HOOKS.filter(element => { if (disabled.indexOf(element) < 0) return true })
    const component = constructor.name;
    LIFECYCLE_HOOKS_APP.forEach(hook => {
      const original = constructor.prototype[hook];
      constructor.prototype[hook] = function (...args) {
        try {
          console.debug(`%c PLTraceHooks -  Class:   ${component} TRACE HOOKS: ${hook}`, `color: green `, args);
          if (original)
            var result = original.apply(this, args);
        } catch (error) {
          console.error(`%c PLTraceHooks -  Class:  ${component}  TRACE HOOKS: ${hook} ERROR: `, `color: red `, error || "");
        }
      }
    });
    return
  }
}
/********************************************************************************************************************** */



/**
 * @author l.piciollo
 * decoratore di classe, riceve in ingresso un flag per indicare se o meno abilitare la routine. il meccanismo prevede l'ascolto
 * dell'evento TYPE_EVENT.PL_SET_PERMISSION, dove viene reperito l'array dei permessi previsti per un utente.
 * ricevuto l'array dei permessi, la routine si occupa di prelevare tutti i DOM che riportano l'attributo  PL-permission, e controlla
 * se contiene o meno uno dei permessi passati precedentemente con il listener. 
 * verranno rimossi tutti i componenti DOM che non soddifano i requisiti
 * la direttiva posta in AppComponent, monitorizza tutta l'applicazione
 * il decoratore rimane in attesa in ad un evento di caricamento.. l'evento deve essere 
 * @example  
 * lanciare document.dispatchEvent(new CustomEvent('PL:SET-PERMISSION', { detail: [PROFILO1,PROFILO2,PROFILO3,...] }));
 * inserire nel DOM <input permission="READONLY" type="text>" e al decoratore passare @PLPermission(true)
 * l'elemento del dom viene elininato in quanto non contiene il permesso READONLY.
 * 
 * per NON far eliminare il componente dalla routin.
 * inserire nel DOM  <input permission="PROFILO1" type="text>" e al decoratore passare @PLPermission(true)*
 * il componente non viene eliminato in quanto il permesso è presente.
 * 
 * @param permission : Array<string>  array di permessi per il quale il componente deve essere presente, se vuoto non verranno
 * elaborate le routine
 */
export function PLPermission(enabled = true): ClassDecorator {
  return function (constructor: any) {
    try {
      if (enabled) {
        console.debug(`%c PLPermission -  Class:  ${constructor.name}  ENABLED PERMISSION CHECK`, `color: green `);
        const component = constructor.name;
        let original = constructor.prototype['ngAfterViewChecked'];
        if (!original) original = () => { }
        let permission: Array<string> = [];

        PlCoreUtils.Broadcast().listenEvent(TYPE_EVENT.PL_SET_PERMISSION, (event: CustomEvent) => {
          permission = event.detail;
          constructor.prototype['ngAfterViewChecked'] = function (...args) {
            if (permission.length > 0)
              document.querySelectorAll('[PL-permission]').forEach(element => {
                let permitted = element.getAttribute("PL-permission").split("|");
                let trovato = false;
                for (let ind = 0; ind < permitted.length && !trovato; ind++) {
                  if (permission.indexOf(permitted[ind]) > -1) {
                    trovato = true;
                  }
                }
                if (!trovato) {
                  (<any>element).parentElement.removeChild(element);
                  console.debug(`%c PLPermission -  Class:  ${constructor.name} PERMISSION DENIED FOUND FOR`, `color: red `, element);
                }
              });
            original.apply(this, args);
          }
          constructor.prototype['ngAfterViewChecked']();
        })
      } else {
        console.debug(`%c PLPermission -  Class:  ${constructor.name}  DISABLED PERMISSION CHECK`, `color: green `);
      }

    } catch (error) {
      console.error(`%c PLTraceAll -  Class:  ${constructor.name} ERROR: `, `color: red `, error || "");
    }

  }
}

