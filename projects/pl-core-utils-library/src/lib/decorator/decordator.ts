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

/**Enumeration per il formato delle date  */
export enum FORMAT_DATE {
  'SHORT' = 'M/d/yy, h:mm a',
  'MEDIUM' = 'MMM d, y, h:mm:ss a',
  'LONG' = 'MMMM d, y, h:mm:ss a z',
  'FULL' = 'EEEE, MMMM d, y, h:mm:ss a zzzz',
  'SHORTDATE' = 'M/d/yy',
  'MEDIUMDATE' = 'MMM d, y',
  'LONGDATE' = 'MMMM d, y',
  'FULLDATE' = 'EEEE, MMMM d, y',
  'SHORTTIME' = 'h:mm a',
  'MEDIUMTIME' = 'h:mm:ss a',
  'LONGTIME' = 'h:mm:ss a z',
  'FULLTIME' = 'h:mm:ss a zzzz',
  'yyyy-MM-ddThh:mm:ss' = 'yyyy-MM-ddThh:mm:ss',
  'yyyy-MM-ddThh:mm:ss.SSS' = 'yyyy-MM-ddThh:mm:ss.SSS',
  'yyyy-MM-ddThh:mm:ss.SSSZ' = 'yyyy-MM-ddThh:mm:ss.SSSZ',
  'dd/MM/yyyy hh:mm:ss' = 'dd/MM/yyyy hh:mm:ss',
  'dd/MM/yyyy' = 'dd/MM/yyyy',
  'hh:mm:ss' = 'hh:mm:ss'
}


export enum FORMAT_NUMBER {
  'EN' = 'en-EN',
  'DE' = 'de-DE',
  'AF' = 'af-AF',
  'AM' = 'am-AM',
  'AR' = 'ar-AR',
  'BN' = 'bn-BN',
  'BG' = 'bg-BG',
  'CA' = 'ca-CA',
  'CS' = 'cs-CS',
  'NL' = 'nl-NL',
  'ET' = 'et-ET',
  'FR' = 'fr-FR',
  'HE' = 'he-HE',
  'HI' = 'hi-HI',
  'IT' = 'it-IT',
  'NB' = 'nb-NB',
  'MS' = 'ms-MS',
  'ID' = 'id-ID',
  'PL' = 'pl-PL'
};


/********************************************************************************************************************** */
/*****************************************          DECORATORE DI METODO           ************************************ */
/********************************************************************************************************************** */

/**
 * @author l.piciollo
 * converte la funzione base in una funzione osservabile. ritardandone l'esecuzione del tempo
 * inserito in ingresso.
 * Es. 
 *    @PLDelay(6000)
 *    prova(){ console.log("test")};
 *
 *  chiamata alla funzione, la risposta si avra 6 secondi dopo
 *    (<any>prova).subscribe(sb=>{})
 * essendo una trasformazione a runtime, occore convertire ad any la funzione altrimenti 
 * non avremo l'ok del compilatore
 * 
 * @param milliseconds 
 */
 import { interval } from 'rxjs';
 import { take, tap} from 'rxjs/operators';
 
export function PLDelay(milliseconds: number = 0) {
  return function (target, key, descriptor) {
    console.debug(`%c PLDelay -  Class:  ${target.constructor.name}  Method: ${key} Delay setted: ${milliseconds}ms`, `color: green `);
    var originalMethod = descriptor.value;
    descriptor.value = function (...args): Observable<any> {
      return new Observable<any>(sb => {
        let obs = interval(milliseconds).pipe(
          take(1),
          tap(() => console.debug(`%c PLDelay -  Class:  ${target.constructor.name}  Method: ${key} STARTED`, `color: green `)),
        ).subscribe(value => {
          sb.next(originalMethod && originalMethod.apply(this, args));
          sb.complete();
          console.debug(`%c PLDelay -  Class:  ${target.constructor.name}  Method: ${key} EXECUTED`, `color: green `);
          obs.unsubscribe()
        });
      })
    };
    return descriptor;
  }
}
/********************************************************************************************************************** */

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
    return
  };
}
/********************************************************************************************************************** */
/*****************************************          DECORATORE DI PROPRIETA'       ************************************ */
/********************************************************************************************************************** */
/**
 * @author l.piciollo
 * decoratore di proprieta per la formattazione delle date..  la direttiva impone che la variabile assume il valore formattato desiderato
 * @param format    :FORMAT_DATE|dstring  indica il formato di data che si vuole ricevere Es. dd/MM/yyyy hh:mm:ss
 * @param local     : indica la localita della data Es. it-IT
 * @param localeId  : indica l'id della locazione Es. it
 * @returns String format
 */
export function PLFormatDate(format: FORMAT_DATE | string = "dd/MM/yyyy hh:mm:ss", local = "it-IT", localeId = "it"): PropertyDecorator {
  return function (target: any, key: string) {
    registerLocaleData(localeIT, localeId);
    let datePipe = new DatePipe(local);
    let _val = target[key];
    let getter = function () {
      try {
        let formatted = datePipe.transform(_val, format);
        if (formatted) {
          console.debug(`%c PLFormatDate -  Class:  ${target.constructor.name}  CONVERSION DATE: ${key} TO: ${format}: `, `color: green `);
          return formatted;
        } else
          return "";
      } catch (error) {
        console.error(`%c PLFormatDate -  Class:  ${target.constructor.name}  CONVERSION DATE: ${key} ERROR: `, `color: red `, error || "");
      }
    };
    let setter = function (newVal) {
      if (newVal instanceof Date) {
        _val = newVal;
      }
    };
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  }
}

/**
 * @author l.piciollo
 * decoratore di proprieta per la formattazione dei numeri..  la direttiva impone che la variabile assume il valore formattato desiderato
 * @param format    :FORMAT_NUMBER|dstring  indica il formato di numero che si vuole ricevere Es. it_IT  
 * @returns String format
 */
export function PLNumberFormat(format: FORMAT_NUMBER | string = FORMAT_NUMBER.IT): PropertyDecorator {
  return function (target: any, key: string) {
     let _val = target[key];
    let getter = function () {
      try {
        let l10nEN = new Intl.NumberFormat(format)
        if (l10nEN) {
          console.debug(`%c PLNumberFormat -  Class:  ${target.constructor.name}  CONVERSION NUMBER: ${key} TO: ${format}: `, `color: green `);
          return l10nEN.format(_val);
        } else
          return _val;
      } catch (error) {
        console.error(`%c PLNumberFormat -  Class:  ${target.constructor.name}  CONVERSION NUMBER: ${key} ERROR: `, `color: red `, error || "");
      }
    };
    let setter = function (newVal) {
      _val = newVal;
    };
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  }
}

/********************************************************************************************************************** */
/*****************************************          DECORATORE DI CLASSE           ************************************ */
/********************************************************************************************************************** */
/**
 * @author l.piciollo
 * decoratore di classe, traccia in console l'esecuzione di una funzione, loggango argomenti passati e risposta ricevuta
 * @param ignore :Array<string>=[]  array di property da non far terminare al decoratore. 
 */
export function PLUnsubscribe(ignore = [] ): ClassDecorator {
  return function (constructor) {
    const original = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function () {
      for (let prop in this) {
        const property = this[prop];
        if (!ignore.includes(prop)) {
          if (property && (typeof property.unsubscribe === "function")) {
            try {
              console.debug(`%c PLUnsubscribe -  Class:   ${constructor.name} unsubscriber: ${prop} `, `color: green `);
              property.unsubscribe();
            } catch (error) {
              console.error(`%c PLUnsubscribe -  Class:  ${constructor.name}  unsubscriber: ${prop} ERROR: `, `color: red `, error || "");
            }
          }
        }
        console.debug(`%c PLUnsubscribe -  Class:   ${constructor.name} unsubscriber IGNORED: ${prop} `, `color: blue `);
      }
    };
    if (original) original.apply(this); 
  }
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

