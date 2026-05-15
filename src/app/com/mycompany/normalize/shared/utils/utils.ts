/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-21 23:18:12
 * @modify date 2019-12-21 23:18:12
 * @desc [Classe di utilita, qui vengono elencate tutte le funzionalità per l'itera applicazione.]
 */
import { ErrorBean, ErrorCode } from 'src/app/com/mycompany/normalize/core/bean/error-bean';

/**
 * @author l.piciollo
 * classe di utilità, qui vengono elencate tutte le funzioni utili per tutta l'applicazione
 */
export class Utils {
  /**
   * @author l.piciollo
   * genera un UUID da assegnare a componenti grafici come ID o altro
   */
  public static UUIDCODE(): any {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = Math.floor(Math.random() * 16);
        const value = char === 'x' ? random : ((random & 0x3) | 0x8);
        return value.toString(16);
      });
    } catch (error : any) {
      throw new ErrorBean(error.message, ErrorCode.SYSTEMERRORCODE, false, false);
    }
  }
}
