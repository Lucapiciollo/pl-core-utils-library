/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2019-12-04 00:03:28
 * @modify date 2019-12-04 00:03:28
 * @desc Utility core della libreria.
 */

import { Subject } from 'rxjs';
import { TYPE_EVENT } from './decorator/decordator';

/**
 * Interfaccia di presentazione per le progressBar.
 * Qui sono definiti gli attributi esposti dal singolo oggetto.
 */
export interface progressBarsInterface {
  [key: string]: {
    uuid: string;
    totalbyte: number;
    byte: number;
    changed: Subject<any>;
    blocked: boolean;
    url: string;
    loaded: string;
    speed: number;
    percent: number;
    size: string;
    interrupt: Subject<any>;
  };
}

export type PlBroadcastEventListener<T = any> = (event: CustomEvent<T>) => void;

/**
 * Classe di utilità.
 * Permette di accedere alla lista delle progressbar e alla gestione eventi.
 */
export class PlCoreUtils {
  /**
   * Variabile contenente le progress di ajax download/upload.
   */
  public static progressBars: progressBarsInterface = {};

  /**
   * Metodi per lancio, registrazione e cancellazione eventi.
   */
  static Broadcast(): {
    execEvent<T = any>(event: TYPE_EVENT | string, object: T): void;
    listenEvent<T = any>(event: TYPE_EVENT | string, callBack: PlBroadcastEventListener<T>): void;
    removeListenEvent<T = any>(event: TYPE_EVENT | string, callBack: PlBroadcastEventListener<T>): void;

    /**
     * @deprecated Usa removeListenEvent.
     */
    removeLlistenEvent<T = any>(event: TYPE_EVENT | string, callBack: PlBroadcastEventListener<T>): void;
  } {
    const removeEvent = <T = any>(
      event: TYPE_EVENT | string,
      callBack: PlBroadcastEventListener<T>
    ): void => {
      if (typeof document === 'undefined') {
        return;
      }

      document.removeEventListener(event, callBack as EventListener, false);
    };

    return {
      execEvent<T = any>(event: TYPE_EVENT | string, object: T): void {
        if (typeof document === 'undefined') {
          return;
        }

        document.dispatchEvent(
          new CustomEvent<T>(event, {
            detail: object
          })
        );
      },

      listenEvent<T = any>(
        event: TYPE_EVENT | string,
        callBack: PlBroadcastEventListener<T>
      ): void {
        if (typeof document === 'undefined') {
          return;
        }

        document.addEventListener(event, callBack as EventListener);
      },

      removeListenEvent: removeEvent,

      removeLlistenEvent: removeEvent
    };
  }
}