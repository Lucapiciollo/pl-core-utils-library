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
   * Ricerca dicotomica asincrona di un elemento in un array ordinato.
   *
   * @param input Oggetto `{ arr, searchElement }` dove `arr` è l'array ordinato e `searchElement` il valore da cercare.
   * @returns Promise che risolve con l'indice dell'elemento trovato, o `-1` se non presente.
   *
   * @example
   * const idx = await utils.binaryFind({ arr: [1, 2, 3, 4], searchElement: 3 }); // idx = 2
   *
   * // Con oggetti custom:
   * const arr = [{id: 1}, {id: 2}];
   * const idx = await utils.binaryFind({ arr, searchElement: {id: 2} });
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
   * Ricerca dicotomica sincrona di un elemento in un array ordinato.
   *
   * @param input Oggetto `{ arr, searchElement }` come per `binaryFind`.
   * @returns Indice dell'elemento trovato, o `-1` se non presente.
   *
   * @example
   * const idx = utils.binaryFindSync({ arr: [10, 20, 30], searchElement: 20 }); // idx = 1
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
   * Osserva le dimensioni della finestra browser in tempo reale.
   *
   * @returns Observable che emette `{ W, h }` a ogni resize.
   *
   * @example
   * utils.traceSizeWindow().subscribe(size => console.log(size.W, size.h));
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
   * Avvia il trace delle dimensioni finestra con callback custom.
   * Mantiene la subscription internamente (utile per componenti singleton).
   *
   * @param callback Funzione chiamata a ogni resize con `{ W, h }`.
   * @returns Subscription attiva (puoi chiamare `.unsubscribe()` per fermare).
   *
   * @example
   * const sub = utils.startTraceSizeWindow(size => console.log(size));
   * // ...
   * sub.unsubscribe();
   */
  public startTraceSizeWindow(callback: (size: PlWindowSize) => void): Subscription {
    this.stopTraceSizeWindow();

    this.traceSizeWindowOBS = this.traceSizeWindow().subscribe(callback);

    return this.traceSizeWindowOBS;
  }


  /**
   * Ferma il trace delle dimensioni finestra avviato con `startTraceSizeWindow`.
   *
   * @example
   * utils.stopTraceSizeWindow();
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