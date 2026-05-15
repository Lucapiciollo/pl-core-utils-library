import { Injectable } from '@angular/core';
import { createPlUuid } from '../utils/pl-uuid.util';
@Injectable({
  providedIn: 'root'
})
export class PLWorkerService {
  /** @ignore */
  private readonly workerFunctionToUrlMap = new WeakMap<Function, string>();

  /** @ignore */
  private readonly promiseToWorkerMap = new WeakMap<Promise<unknown>, Worker>();

  /**
   * Funzionalità per la virtualizzazione di un codice elaborato.
   * Il codice viene eseguito in un thread separato dal main thread.
   *
   * Nota: workerFunction e initProcess non devono essere arrow function
   * se vuoi serializzarle correttamente dentro il worker.
   *
   * @param workerFunction Promise/funzione da virtualizzare in un thread separato.
   * @param nameThred Nome da assegnare al thread, utile per i log.
   * @param initProcess Funzione richiamata per i log di start/end processo.
   * @param data Oggetto contenente i parametri da passare alla funzione workerFunction.
   * @param singolInstance Se true crea un nuovo worker URL anche se la funzione era già mappata.
  * @returns Promise con il risultato prodotto dal worker.
   */
  public run<T = any>(
    workerFunction: (input: any) => Promise<T> | T,
    nameThred: string,
    initProcess: (message: string) => void = () => {},
    data?: any,
    singolInstance = false
  ): Promise<T> {
    if (this.isWorkerSupported()) {
      const url = this.getOrCreateWorkerUrl(
        workerFunction,
        initProcess,
        nameThred,
        singolInstance
      );

      return this.runUrl<T>(url, data);
    }

    return this.runInMainThread(workerFunction, nameThred, initProcess, data);
  }

  /**
   * Funzionalità di esecuzione di uno script in formato blob/url.
   *
   * @param url URL del worker.
   * @param data Dati da inviare al worker.
    * @returns Promise con il payload di risposta del worker.
   */
  public runUrl<T = any>(url: string, data?: any): Promise<T> {
    if (!this.isWorkerSupported()) {
      return Promise.reject(new Error("Can't run worker in this environment"));
    }

    const worker = this.createWorker(url);
    const promise = this.createPromiseForWorker<T>(worker, data);
    const promiseCleaner = this.createPromiseCleaner<T>(promise);

    this.promiseToWorkerMap.set(promise, worker);

    promise.then(promiseCleaner).catch(promiseCleaner);

    return promise;
  }

  /**
   * Recupera il worker associato a una Promise.
   *
   * @param promise Promise restituita da run/runUrl.
    * @returns Istanza worker associata oppure `undefined`.
   */
  public getWorker<T = any>(promise: Promise<T>): Worker | undefined {
    return this.promiseToWorkerMap.get(promise);
  }

  /**
   * Termina il worker associato a una Promise.
   *
   * @param promise Promise restituita da run/runUrl.
   */
  public terminateWorker<T = any>(promise: Promise<T>): void {
    this.removePromise(promise);
  }

  private isWorkerSupported(): boolean {
    return typeof Worker !== 'undefined';
  }

  private createWorker(url: string): Worker {
    if (!this.isWorkerSupported()) {
      throw new Error('Web Worker is not supported in this environment');
    }

    return new Worker(url);
  }

  private runInMainThread<T = any>(
    workerFunction: (input: any) => Promise<T> | T,
    nameThred: string,
    initProcess: (message: string) => void,
    data?: any
  ): Promise<T> {
    const uuid = createPlUuid();
    const initTime = new Date().getTime();

    try {
      initProcess(`START WORK: ${nameThred} ID: ${uuid}`);

      return Promise.resolve(workerFunction(data)).then(response => {
        const elapsed = ((new Date().getTime() - initTime) / 1000).toString();
        initProcess(`END WORK: ${nameThred} ID: ${uuid} in : ** ${elapsed}s **`);

        return response;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /** @ignore */
  private removePromise<T = any>(promise: Promise<T>): Promise<T> {
    const worker = this.promiseToWorkerMap.get(promise);

    if (worker) {
      try {
        worker.terminate();
      } catch {}
    }

    this.promiseToWorkerMap.delete(promise);

    return promise;
  }

  /** @ignore */
  private createPromiseCleaner<T = any>(promise: Promise<T>): (input: T) => T {
    return event => {
      this.removePromise(promise);

      return event;
    };
  }

  /** @ignore */
  private createPromiseForWorker<T = any>(worker: Worker, data: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const cleanup = (): void => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        worker.removeEventListener('messageerror', onMessageError);
      };

      const onMessage = (event: MessageEvent): void => {
        const payload = event.data;

        cleanup();

        if (payload?.__plWorkerError) {
          reject(this.normalizeWorkerError(payload.error));
          return;
        }

        if (payload?.__plWorkerSuccess) {
          resolve(payload.data as T);
          return;
        }

        resolve(payload as T);
      };

      const onError = (error: ErrorEvent): void => {
        cleanup();
        reject(error);
      };

      const onMessageError = (error: MessageEvent): void => {
        cleanup();
        reject(error);
      };

      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);
      worker.addEventListener('messageerror', onMessageError);

      try {
        worker.postMessage(data);
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
  }

  /** @ignore */
  private normalizeWorkerError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    return new Error(error?.message ?? 'Worker execution error');
  }

  /** @ignore */
  private createWorkerUrl(
    resolve: Function,
    init: (message: string) => void,
    nameThred: string
  ): string {
    const resolveString = resolve.toString();
    const initString = init.toString();
    const uuid = createPlUuid();

    const webWorkerTemplate = `
      const __plWorkerInit = ${initString};
      const __plWorkerResolve = ${resolveString};

      self.addEventListener('message', function (e) {
        const initProcess = new Date().getTime();

        try {
          __plWorkerInit('START WORK: ${nameThred} ID: ${uuid}');

          Promise.resolve(__plWorkerResolve(e.data))
            .then(function (response) {
              self.postMessage({
                __plWorkerSuccess: true,
                data: response
              });

              __plWorkerInit(
                'END WORK: ${nameThred} ID: ${uuid} in : ** '
                  .concat(((new Date().getTime()) - initProcess) / 1000)
                  .concat('s **')
              );
            })
            .catch(function (error) {
              self.postMessage({
                __plWorkerError: true,
                error: {
                  message: error && error.message ? error.message : String(error),
                  stack: error && error.stack ? error.stack : null
                }
              });
            });
        } catch (error) {
          self.postMessage({
            __plWorkerError: true,
            error: {
              message: error && error.message ? error.message : String(error),
              stack: error && error.stack ? error.stack : null
            }
          });
        }
      });
    `;

    const blob = new Blob([webWorkerTemplate], {
      type: 'text/javascript'
    });

    return URL.createObjectURL(blob);
  }

  /** @ignore */
  private getOrCreateWorkerUrl(
    fn: Function,
    init: (message: string) => void,
    nameThred: string,
    singolInstance: boolean
  ): string {
    if (!this.workerFunctionToUrlMap.has(fn) || singolInstance) {
      const url = this.createWorkerUrl(fn, init, nameThred);
      this.workerFunctionToUrlMap.set(fn, url);

      return url;
    }

    return this.workerFunctionToUrlMap.get(fn) as string;
  }
}