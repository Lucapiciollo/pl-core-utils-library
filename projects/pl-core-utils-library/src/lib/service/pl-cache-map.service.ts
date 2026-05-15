import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

/**
 * Token per identificare il tag usato nelle chiamate cacheabili.
 */
export const CACHE_TAG = new InjectionToken<string>('CACHE_TAG');

/**
 * Token per identificare il tempo massimo di validità cache.
 */
export const MAX_CACHE_AGE = new InjectionToken<number>('MAX_CACHE_AGE');

export interface PlCacheItem<T = any> {
  value: T;
  timestamp: number;
  maxAge: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlCacheMapService {
  private readonly cache = new Map<string, PlCacheItem>();

  constructor(
    @Optional() @Inject(MAX_CACHE_AGE) private readonly maxCacheAge: number | null,
    @Optional() @Inject(CACHE_TAG) private readonly cacheTag: string | null
  ) {}

  /**
   * Restituisce il tag cache configurato.
    * @returns Tag cache corrente.
   */
  getCacheTag(): string {
    return this.cacheTag ?? '@cachable@';
  }

  /**
   * Restituisce il tempo massimo cache configurato.
    * @returns Durata massima cache in millisecondi.
   */
  getMaxCacheAge(): number {
    return this.maxCacheAge ?? 300000;
  }

  /**
   * Verifica se una URL contiene il tag cache.
    * @param url URL da verificare.
    * @returns `true` se la URL contiene il tag cache.
   */
  hasCacheTag(url: string): boolean {
    return url.includes(this.getCacheTag());
  }

  /**
   * Rimuove il tag cache da una URL.
    * @param url URL da normalizzare.
    * @returns URL senza cache tag.
   */
  removeCacheTag(url: string): string {
    return url.replace(this.getCacheTag(), '');
  }

  /**
   * Salva un valore in cache.
    * @param key Chiave cache.
    * @param value Valore da memorizzare.
    * @param maxAge Durata elemento cache in millisecondi.
   */
  set<T = any>(key: string, value: T, maxAge = this.getMaxCacheAge()): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      maxAge
    });
  }

  /**
   * Recupera un valore dalla cache.
    * @param key Chiave cache.
    * @returns Valore trovato oppure `null` se assente/scaduto.
   */
  /**
   * Recupera un valore dalla cache, se presente e non scaduto.
   * @param key Chiave cache.
   * @returns Valore trovato oppure `null` se assente/scaduto.
   * @example
   * const value = service.get('myKey');
   */
  get<T = any>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Verifica se una chiave è presente ed è ancora valida.
    * @param key Chiave cache.
    * @returns `true` se esiste un elemento non scaduto.
   */
  /**
   * Verifica se una chiave è presente ed è ancora valida.
   * @param key Chiave cache.
   * @returns `true` se esiste un elemento non scaduto.
   * @example
   * if (service.has('myKey')) { ... }
   */
  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Rimuove una chiave dalla cache.
    * @param key Chiave cache da eliminare.
    * @returns `true` se la chiave è stata rimossa.
   */
  /**
   * Rimuove una chiave dalla cache.
   * @param key Chiave cache da eliminare.
   * @returns `true` se la chiave è stata rimossa.
   * @example
   * service.delete('myKey');
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Pulisce tutta la cache.
   */
  /**
   * Pulisce tutta la cache.
   * @example
   * service.clear();
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Restituisce tutte le chiavi presenti.
    * @returns Lista delle chiavi cache.
   */
  /**
   * Restituisce tutte le chiavi presenti in cache.
   * @returns Lista delle chiavi cache.
   * @example
   * const allKeys = service.keys();
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Restituisce la dimensione della cache.
    * @returns Numero elementi presenti in cache.
   */
  /**
   * Restituisce la dimensione della cache (numero di elementi).
   * @returns Numero elementi presenti in cache.
   * @example
   * const n = service.size();
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Verifica se un elemento cache è scaduto.
   * @param item Oggetto cache.
   * @returns `true` se scaduto.
   */
  private isExpired(item: PlCacheItem): boolean {
    return Date.now() - item.timestamp > item.maxAge;
  }
}