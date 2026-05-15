/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-17 23:04:27
 * @modify date 2020-11-17 23:04:27
 * @desc Servizio cache map per gestione cache temporanea delle chiamate HTTP.
 */

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
   */
  getCacheTag(): string {
    return this.cacheTag ?? '@cachable@';
  }

  /**
   * Restituisce il tempo massimo cache configurato.
   */
  getMaxCacheAge(): number {
    return this.maxCacheAge ?? 300000;
  }

  /**
   * Verifica se una URL contiene il tag cache.
   */
  hasCacheTag(url: string): boolean {
    return url.includes(this.getCacheTag());
  }

  /**
   * Rimuove il tag cache da una URL.
   */
  removeCacheTag(url: string): string {
    return url.replace(this.getCacheTag(), '');
  }

  /**
   * Salva un valore in cache.
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
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Pulisce tutta la cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Restituisce tutte le chiavi presenti.
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Restituisce la dimensione della cache.
   */
  size(): number {
    return this.cache.size;
  }

  private isExpired(item: PlCacheItem): boolean {
    return Date.now() - item.timestamp > item.maxAge;
  }
}