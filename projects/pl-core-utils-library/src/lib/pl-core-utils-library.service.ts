/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2019-12-04 00:03:28
 * @modify date 2019-12-04 00:03:28
 * @desc [description]
 */
import { TYPE_EVENT } from './decorator/decordator';
import { Subject } from 'rxjs';

/**
 * @author l.piciollo
 * interfaccia di presentazione per la progressBar object, qui sono definiti gli attributi esposti dal singolo oggetto
 */
export interface progressBarsInterface {
  [key: string]: {
    uuid: string,
    totalbyte: number,
    byte: number,
    changed: Subject<any>,
    blocked: boolean,
    url: string,
    loaded: string,
    speed: 0,
    percent: number,
    size: string,
    interrupt: Subject<boolean>
  }
}

/**
 * classe di utilità, è possibile risalire alla lista delle progressbar e alla registrazione di eventi
 */
export class PlCoreUtils {

  /**variabile contenente le progress di ajax down e upload */
  public static progressBars: progressBarsInterface = {};


  constructor() { }

  /**
   * metodi per il lancio di eventi , registrazione e cancellazione degli seìtesi .. 
   */
  static Broadcast() {
    return {
      execEvent(event: TYPE_EVENT | string, object: any): void {
        try {
          document.dispatchEvent(new CustomEvent(event, { detail: object }));
        } catch (e) {
          throw e
        }
      },
      listenEvent(event: TYPE_EVENT | string, callBack: any) {
        try {
          document.addEventListener(event, callBack);
        } catch (e) {
          throw e
        }
      },
      removeLlistenEvent(event: TYPE_EVENT | string, callBack: any): void {
        try {
          document.removeEventListener(event, callBack, false);
        } catch (e) {
          throw e
        }
      }
    }
  }




}
