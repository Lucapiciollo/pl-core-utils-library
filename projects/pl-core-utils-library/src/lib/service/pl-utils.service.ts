import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

/**
 * @author l.piciollo
 * classe di servizio che espone metodi di utilità
 */
@Injectable({
  providedIn: 'root'
})
export class PlUtilsService {
  private traceSizeWindowOBS: Subscription;
  constructor() { }
  /********************************************************************************************************* */
  /**
   * @l.piciollo
   * ricerca dicotomica di un elemento in un array ordinato
   * @param input : valore da cercare
   */
  public binaryFind = function (input: any): Promise<any> {
    return new Promise<any>((ok, ko) => {
      let minIndex = 0;
      let maxIndex = input.arr.length - 1;
      let currentIndex;
      let currentElement;
      while (minIndex <= maxIndex) {
        currentIndex = Math.floor((minIndex + maxIndex) / 2);
        currentElement = input.arr[currentIndex];
        if (currentElement < input.searchElement) {
          minIndex = currentIndex + 1;
        } else if (currentElement > input.searchElement) {
          maxIndex = currentIndex - 1;
        } else {
          ok(currentIndex);
          return currentIndex;
        }
      }
      ok(-1);
      return -1;
    })
  };
  /****************************************************************************************** */

  /**
   * @author l.piciollo
   * abilita il trace del ridimensionamento dello schermo.. ritorna la misura della larghezza
   */
   public traceSizeWindow(): Observable<any> {
    return  fromEvent(window, 'resize')
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(() =>{ return {W:window.innerWidth, h:window.innerHeight}}),
        );
  }

  /**
   * @author l.piciollo
   * disabilita il trace del controllo dimesione schermo
   */
  public stopTraceSizeWindow() {
    try {
      this.traceSizeWindowOBS.unsubscribe();
    } catch (e) {
      throw e;
    }
  }


 



}
