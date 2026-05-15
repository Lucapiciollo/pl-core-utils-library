import { Injectable } from '@angular/core';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

/**
 * Dimensione finestra.
 */
export interface PlWindowSize {
  W: number;
  h: number;
}

/**
 * Input per ricerca dicotomica.
 */
export interface PlBinaryFindInput<T = any> {
  arr: T[];
  searchElement: T;
}

/**
 * Classe di servizio che espone metodi di utilità.
 */
@Injectable({
  providedIn: 'root'
})
export class PlUtilsService {
  private traceSizeWindowOBS: Subscription | null = null;

  constructor() {}

  /**
   * Ricerca dicotomica di un elemento in un array ordinato.
   *
   * Ritorna l'indice dell'elemento trovato.
   * Se non trovato, ritorna -1.
   */
  public binaryFind<T = any>(input: PlBinaryFindInput<T>): Promise<number> {
    return new Promise<number>(resolve => {
      let minIndex = 0;
      let maxIndex = input.arr.length - 1;

      while (minIndex <= maxIndex) {
        const currentIndex = Math.floor((minIndex + maxIndex) / 2);
        const currentElement = input.arr[currentIndex];

        if (currentElement < input.searchElement) {
          minIndex = currentIndex + 1;
          continue;
        }

        if (currentElement > input.searchElement) {
          maxIndex = currentIndex - 1;
          continue;
        }

        resolve(currentIndex);
        return;
      }

      resolve(-1);
    });
  }

  /**
   * Versione sincrona della ricerca dicotomica.
   */
  public binaryFindSync<T = any>(input: PlBinaryFindInput<T>): number {
    let minIndex = 0;
    let maxIndex = input.arr.length - 1;

    while (minIndex <= maxIndex) {
      const currentIndex = Math.floor((minIndex + maxIndex) / 2);
      const currentElement = input.arr[currentIndex];

      if (currentElement < input.searchElement) {
        minIndex = currentIndex + 1;
        continue;
      }

      if (currentElement > input.searchElement) {
        maxIndex = currentIndex - 1;
        continue;
      }

      return currentIndex;
    }

    return -1;
  }

  /**
   * Abilita il trace del ridimensionamento dello schermo.
   * Ritorna la misura della larghezza e altezza finestra.
   */
  public traceSizeWindow(): Observable<PlWindowSize> {
    if (typeof window === 'undefined') {
      return of({
        W: 0,
        h: 0
      });
    }

    return fromEvent(window, 'resize').pipe(
      debounceTime(200),
      startWith(null),
      map(() => this.getWindowSize()),
      distinctUntilChanged((prev, curr) => prev.W === curr.W && prev.h === curr.h)
    );
  }

  /**
   * Avvia internamente il trace del resize.
   * Utile se vuoi mantenere una subscription interna al servizio.
   */
  public startTraceSizeWindow(callback: (size: PlWindowSize) => void): Subscription {
    this.stopTraceSizeWindow();

    this.traceSizeWindowOBS = this.traceSizeWindow().subscribe(callback);

    return this.traceSizeWindowOBS;
  }

  /**
   * Disabilita il trace del controllo dimensione schermo.
   */
  public stopTraceSizeWindow(): void {
    this.traceSizeWindowOBS?.unsubscribe();
    this.traceSizeWindowOBS = null;
  }

  private getWindowSize(): PlWindowSize {
    if (typeof window === 'undefined') {
      return {
        W: 0,
        h: 0
      };
    }

    return {
      W: window.innerWidth,
      h: window.innerHeight
    };
  }
}