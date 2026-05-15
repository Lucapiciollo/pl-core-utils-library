
/**
 * @file pl-to-async-iterator.ts
 * @description
 * Estende automaticamente `Array.prototype` con API avanzate per la reattività e l’iterazione asincrona.
 *
 * ## Funzionalità principali
 * - `toReactiveArray()`: restituisce un Proxy che notifica ogni mutazione dell’array ai listener.
 * - `onArrayChange(listener)`: registra un listener per tutte le mutazioni (push, set, splice, ...).
 * - `toAsyncIterator(options?)`: trasforma l’array in un iteratore asincrono che può emettere sia i valori iniziali che tutte le mutazioni future, con opzioni avanzate (delay, abort, callback, ...).
 *
 * ## Esempi d’uso
 *
 * Reactive array e ascolto mutazioni:
 * ```ts
 * const arr = [1, 2, 3].toReactiveArray();
 * const unsubscribe = arr.onArrayChange(change => {
 *   console.log('Mutazione:', change.type, change);
 * });
 * arr.push(4); // notifica il listener
 * unsubscribe();
 * ```
 *
 * Iterazione asincrona con delay e ascolto live:
 * ```ts
 * for await (const item of arr.toAsyncIterator({ delayMs: 100, live: true })) {
 *   console.log('Elemento o mutazione:', item);
 * }
 * ```
 *
 * Iterazione solo sui valori iniziali:
 * ```ts
 * for await (const item of arr.toAsyncIterator({ live: false, emitInitial: false })) {
 *   console.log('Solo valori:', item);
 * }
 * ```
 *
 * Abort dell’iterazione:
 * ```ts
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 500);
 * for await (const item of arr.toAsyncIterator({ signal: controller.signal })) {
 *   // ...
 * }
 * ```
 *
 * ## Note
 * - Le patch sono applicate automaticamente importando la libreria: non serve importare questo file manualmente.
 * - Le API sono disponibili su tutti gli array, anche creati dinamicamente.
 * - Ideale per pattern reattivi, animazioni, sincronizzazione dati, testing, e casi d’uso avanzati in Angular, RxJS, ecc.
 *
 * @author Luca Piciollo
 * @since 2026
 */
export { };

/**
 * Utility runtime per estendere `Array.prototype` con API reattive e asincrone:
 * - `toReactiveArray()`
 * - `onArrayChange()`
 * - `toAsyncIterator()`
 *
 * ⚠️ Nota importante:
 * questo file deve essere importato almeno una volta in runtime
 * (es. da `public-api.ts` o da un modulo bootstrap) per applicare il patch al prototipo.
 */

const ARRAY_CHANGE_LISTENERS = Symbol('ARRAY_CHANGE_LISTENERS');

type ArrayChangeType =
    | 'set'
    | 'push'
    | 'pop'
    | 'shift'
    | 'unshift'
    | 'splice'
    | 'sort'
    | 'reverse';

interface ArrayChange<T> {
    type: ArrayChangeType;
    property?: string | symbol;
    value?: T;
    oldValue?: T;
    index?: number;
    args?: unknown[];
    array: T[];
}

type ArrayChangeListener<T> = (change: ArrayChange<T>) => void;

/**
 * Opzioni per `toAsyncIterator()`.
 */
interface ToAsyncIteratorOptions<T> {
    /** Ritardo tra emissioni in ms. Default: `0`. */
    delayMs?: number;
    /** Se `true`, resta in ascolto dei cambiamenti dell'array. Default: `true`. */
    live?: boolean;
    /** Se `true`, emette lo stato iniziale come eventi `set`. Default: `false`. */
    emitInitial?: boolean;
    /** Se `true`, emette gli eventi di mutazione (`push`, `splice`, ...). Default: `false`. */
    emitChanges?: boolean;
    /** Segnale per interrompere l'iterazione. */
    signal?: AbortSignal;
    /** Callback invocata a ogni modifica dell'array (anche se `emitChanges` è `false`). */
    onChange?: (change: ArrayChange<T>) => void;
    /** Callback invocata quando l'iterazione termina normalmente. */
    onComplete?: () => void;
    /** Callback invocata in caso di abort. */
    onAbort?: () => void;
}

declare global {
    interface Array<T> {
        /**
         * Restituisce un `Proxy` dell'array che notifica le mutazioni tramite `onArrayChange()`.
         */
        toReactiveArray(): T[];

        /**
         * Registra un listener di mutazioni dell'array.
         * @returns funzione di unsubscribe.
         */
        onArrayChange(listener: ArrayChangeListener<T>): () => void;

        /**
         * Converte l'array in iteratore asincrono.
         *
         * Esempio rapido:
         * ```ts
         * const arr = [1, 2, 3].toReactiveArray();
         * for await (const item of arr.toAsyncIterator({ delayMs: 250 })) {
         *   console.log(item);
         * }
         * ```
         */
        toAsyncIterator(options?: ToAsyncIteratorOptions<T>): AsyncIterableIterator<T | ArrayChange<T>>;
    }
}

function getListeners<T>(array: T[]): Set<ArrayChangeListener<T>> {
    const target = array as T[] & {
        [ARRAY_CHANGE_LISTENERS]?: Set<ArrayChangeListener<T>>;
    };

    if (!target[ARRAY_CHANGE_LISTENERS]) {
        Object.defineProperty(target, ARRAY_CHANGE_LISTENERS, {
            value: new Set<ArrayChangeListener<T>>(),
            enumerable: false,
            configurable: false,
        });
    }

    return target[ARRAY_CHANGE_LISTENERS]!;
}

function notify<T>(array: T[], change: Omit<ArrayChange<T>, 'array'>): void {
    const fullChange: ArrayChange<T> = {
        ...change,
        array,
    };

    getListeners(array).forEach((listener) => listener(fullChange));
}

function isArrayIndex(property: string | symbol): boolean {
    if (typeof property !== 'string') return false;

    const index = Number(property);

    return Number.isInteger(index) && index >= 0;
}


/**
 * Registra un listener per tutte le mutazioni dell’array (push, set, splice, ...).
 * @template T
 * @param this Array su cui registrare il listener
 * @param listener Funzione che riceve un oggetto ArrayChange<T> ad ogni mutazione
 * @returns Funzione di unsubscribe per rimuovere il listener
 * @example
 *   const arr = [1,2,3].toReactiveArray();
 *   const unsub = arr.onArrayChange(change => console.log(change));
 *   arr.push(4); // notifica il listener
 *   unsub();
 */
if (!Array.prototype.onArrayChange) {
    Array.prototype.onArrayChange = function <T>(
        this: T[],
        listener: ArrayChangeListener<T>,
    ): () => void {
        const listeners = getListeners(this);
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    };
}


/**
 * Restituisce un Proxy dell’array che notifica ogni mutazione ai listener registrati tramite onArrayChange.
 * Intercetta sia le assegnazioni per indice che tutti i metodi mutanti (push, pop, shift, unshift, splice, sort, reverse).
 * @template T
 * @param this Array da rendere reattivo
 * @returns Proxy reattivo dell’array
 * @example
 *   const arr = [1,2,3].toReactiveArray();
 *   arr[0] = 99; // notifica 'set'
 *   arr.push(4); // notifica 'push'
 */
if (!Array.prototype.toReactiveArray) {
    Array.prototype.toReactiveArray = function <T>(this: T[]): T[] {
        const source = this;

        return new Proxy(source, {
            set(target, property, value, receiver) {
                const oldValue = Reflect.get(target, property, receiver);
                const result = Reflect.set(target, property, value, receiver);

                if (property !== 'length' && oldValue !== value) {
                    notify(target, {
                        type: 'set',
                        property,
                        value,
                        oldValue,
                        index: isArrayIndex(property) ? Number(property) : undefined,
                    });
                }

                return result;
            },

            get(target, property, receiver) {
                const original = Reflect.get(target, property, receiver);

                if (
                    typeof property === 'string' &&
                    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(property)
                ) {
                    return (...args: unknown[]) => {
                        const result = original.apply(target, args);

                        notify(target, {
                            type: property as ArrayChangeType,
                            args,
                        });

                        return result;
                    };
                }

                return original;
            },
        });
    };
}


/**
 * Itera elementi e/o eventi di mutazione dell’array in modo asincrono.
 * Permette di ascoltare sia i valori iniziali che tutte le mutazioni future, con opzioni avanzate (delay, abort, callback, ...).
 * @template T
 * @param this Array da iterare
 * @param options Opzioni di iterazione (delayMs, live, emitInitial, emitChanges, signal, onChange, onComplete, onAbort)
 * @returns AsyncIterableIterator<T | ArrayChange<T>>
 * @example
 *   for await (const item of arr.toAsyncIterator({ delayMs: 100, live: true })) {
 *     console.log(item);
 *   }
 * @example
 *   // Solo valori iniziali:
 *   for await (const item of arr.toAsyncIterator({ live: false, emitInitial: false })) {
 *     ...
 *   }
 * @example
 *   // Abort:
 *   const controller = new AbortController();
 *   for await (const item of arr.toAsyncIterator({ signal: controller.signal })) { ... }
 */
if (!Array.prototype.toAsyncIterator) {
    Array.prototype.toAsyncIterator = function <T>(
        this: T[],
        options: ToAsyncIteratorOptions<T> = {},
    ): AsyncIterableIterator<T | ArrayChange<T>> {
        const {
            delayMs = 0,
            live = true,
            emitInitial = true,
            emitChanges = true,
            signal,
            onChange,
            onComplete,
            onAbort,
        } = options;

        return (async function* (this: T[]) {
            let index = 0;
            let wake: (() => void) | null = null;
            const queue: ArrayChange<T>[] = [];

            const wait = (): Promise<void> =>
                new Promise((resolve) => {
                    wake = resolve;
                });

            const unsubscribe = live
                ? this.onArrayChange((change) => {
                    onChange?.(change);

                    if (emitChanges) {
                        queue.push(change);
                    }

                    wake?.();
                    wake = null;
                })
                : undefined;

            try {
                if (emitInitial) {
                    for (let i = 0; i < this.length; i++) {
                        if (delayMs > 0) {
                            await delay(delayMs, signal);
                        }

                        yield {
                            type: 'set' as ArrayChangeType,
                            property: String(i),
                            value: this[i],
                            index: i,
                            array: this,
                        };
                    }
                }

                while (true) {
                    if (signal?.aborted) {
                        onAbort?.();
                        return;
                    }

                    if (emitChanges && queue.length > 0) {
                        yield queue.shift()!;
                        continue;
                    }

                    if (!emitInitial && index < this.length) {
                        if (delayMs > 0) {
                            await delay(delayMs, signal);
                        }

                        yield this[index];
                        index++;
                        continue;
                    }

                    if (!live) {
                        onComplete?.();
                        return;
                    }

                    await wait();
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    onAbort?.();
                    return;
                }

                throw error;
            } finally {
                unsubscribe?.();
            }
        }).call(this);
    };
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
        }

        const timeoutId = setTimeout(resolve, ms);

        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timeoutId);
                reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
        );
    });
}