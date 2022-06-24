import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';


/**
 * @author l.piciollo
 * classe di virtualizzazione worker process, si occupa di virtualizzare blocchi di codice che possono girare in background
 * scaricando il browser da appesantimenti dovuti a calcoli impattanti.
 */
@Injectable({
  providedIn: 'root'
})
export class PLWorkerService {
  /**@ignore */
  private workerFunctionToUrlMap = new WeakMap<Function, string>();
  /**@ignore */
  private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();

  /**
   * @l.piciollo
  * Funzionalità per la virtualizzazione di un codice elaborato, viene virtualizzato ed eseguito in un thread separato dal main
   * @param workerFunction  : promise da virtualizzare in un thread separato ..   non accetta arrow function
   * @param nameThred: nome da assegnare al thread, utile per i log.
   * @param initProcess : funzione richiamata al momento della partezza del processo ..   non accetta arrow function 
   * @param data : oggetto contenente i parametri da passare alla funzione workerFunction, in caso di piu parametri , passare un JSON
   * @param singolInstance: valore booleano che indica se occorre creare un nuovo worker oppure utilizzare il gia presente, in caso fosse gia in esecuzione
   */
  public run<T>(workerFunction: (input: any) => T, nameThred: string, initProcess: (init) => void, data?: any, singolInstance: boolean = false): Promise<T> {
    if (typeof (Worker) !== "undefined") {
      const url = this.getOrCreateWorkerUrl(workerFunction, initProcess, nameThred, singolInstance);
      return this.runUrl(url, data);
    } else {
      return new Promise<any>((ok, ko) => {
        const resolveString = workerFunction.toString();
        `((${resolveString})(data)).then(
          response=>{                    
            ok(response);
        ).catch(e => { 
            ko(e);
        });`;
      })
    }
  }

  /**
   * @author l.piciollo
   * funzionalita di esecuzione di uno script in formato blob
   * @param url 
   * @param data 
   */
  public runUrl(url: string, data?: any): Promise<any> {
    if (typeof (Worker) !== "undefined") {
      const worker = new Worker(url);
      const promise = this.createPromiseForWorker(worker, data);
      const promiseCleaner = this.createPromiseCleaner(promise);
      this.promiseToWorkerMap.set(promise, worker);
      promise.then(promiseCleaner).catch(promiseCleaner);
      return promise;
    } else {
      return new Promise<any>((ok, ko) => {
        ko(new Error("Can't run worker in this ambient.."))
      })
    }

  }

  /**
   * @ignore
   * @param promise 
   */
  private removePromise<T>(promise: Promise<T>): Promise<T> {
    const worker = this.promiseToWorkerMap.get(promise);
    if (worker) {
      worker.terminate();
    }
    this.promiseToWorkerMap.delete(promise);
    return promise;
  }

  /**
   * @ignore
   * @param promise 
   */
  private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
    return (event) => {
      this.removePromise(promise);
      return event;
    };
  }

  /**
 * @ignore
 * @param worker 
 * @param data 
 */
  private createPromiseForWorker<T>(worker: Worker, data: any) {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener('message', (event) => {
        resolve(event.data)
      })
      worker.addEventListener('error', reject);
      worker.postMessage(data);
    });
  }

  /**
   * @ignore
   */
  private createWorkerUrl(resolve: Function, init: Function, nameThred: String): string {
    const resolveString = resolve.toString();
    const uuid = UUID.UUID();
    const webWorkerTemplate = `
            ((${init.toString()})('START WORK: ${nameThred} ID: ${uuid}' ))             
            self.addEventListener('message', (e)=> {   
                 var initProcess= new Date().getTime();                  
                 ((${resolveString})(e.data)).then(
                  response=>{                    
                    postMessage(response);
                    ((${init.toString()})( 'END WORK: ${nameThred}  ID:  ${uuid} in :  ** '.concat( ((new Date().getTime()) - initProcess)/1000   ).concat('s **')    )) ;                     
                   }
                ).catch(e => { 
                  ko(e);
              });
            });
        `;
    const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
    return URL.createObjectURL(blob);
  }

  /**
   * @ignore
   * @param fn 
   * @param init 
   * @param nameThred 
   * @param singolInstance 
   */
  private getOrCreateWorkerUrl(fn: Function, init: (init) => void, nameThred: String, singolInstance: boolean): string {
    if (!this.workerFunctionToUrlMap.has(fn) || singolInstance) {
      const url = this.createWorkerUrl(fn, init, nameThred);
      this.workerFunctionToUrlMap.set(fn, url);
      return url;
    }
    return this.workerFunctionToUrlMap.get(fn);
  }

  /**
   * @ignore
   * @param promise 
   */
  public getWorker(promise: Promise<any>): Worker {
    return this.promiseToWorkerMap.get(promise);
  }

}