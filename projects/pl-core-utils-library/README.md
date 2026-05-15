---

## 📄 pl-to-async-iterator.ts — Estensioni asincrone e reattive per Array

Questo file, importato automaticamente dalla libreria, patcha a runtime tutti gli array JavaScript con API avanzate per la reattività e l’iterazione asincrona.

### API disponibili

- **toReactiveArray()**: restituisce un Proxy dell’array che notifica ogni mutazione ai listener registrati.
- **onArrayChange(listener)**: registra un listener che riceve dettagli su ogni mutazione (push, set, splice, ecc.). Ritorna una funzione di unsubscribe.
- **toAsyncIterator(options?)**: trasforma l’array in un iteratore asincrono che può emettere sia i valori iniziali che tutte le mutazioni future, con opzioni avanzate (delay, abort, callback, ecc.).

#### Tipi utili
- `ArrayChange<T>`: descrive la mutazione (tipo, valore, indice, ecc.)
- `ToAsyncIteratorOptions<T>`: opzioni per l’iterazione asincrona (delay, live, emitChanges, signal, callback, ...)

### Esempi pratici

```ts
// Reactive array e ascolto mutazioni
const arr = [1, 2, 3].toReactiveArray();
const unsubscribe = arr.onArrayChange(change => {
  console.log('Mutazione:', change.type, change);
});
arr.push(4); // notifica il listener
unsubscribe();

// Iterazione asincrona con delay e ascolto live
for await (const item of arr.toAsyncIterator({ delayMs: 100, live: true })) {
  console.log('Elemento o mutazione:', item);
}

// Iterazione solo sui valori iniziali
for await (const item of arr.toAsyncIterator({ live: false, emitInitial: false })) {
  console.log('Solo valori:', item);
}

// Abort dell’iterazione
const controller = new AbortController();
setTimeout(() => controller.abort(), 500);
for await (const item of arr.toAsyncIterator({ signal: controller.signal })) {
  // ...
}
```

**Nota:** tutte queste API sono disponibili su qualsiasi array dopo aver importato la libreria, senza import espliciti del file.


# 🚀 pl-core-utils-library

**pl-core-utils-library** è la soluzione definitiva per lo sviluppo Angular enterprise: una libreria professionale, modulare e production-ready che offre utility avanzate, servizi, componenti e decorator per ogni esigenza di sviluppo moderno. Include estensioni prototype sicure, progress bar avanzate, gestione cache, worker, grafica, event bus, mock, decorator, e molto altro.

---

## ✨ Caratteristiche principali

- **Chiamate HTTP avanzate**: progress bar, stream, blob, mock, interrupt, gestione header/query dinamici
- **Progress bar centralizzate**: tracciamento avanzamento download/upload via `PlCoreUtils.progressBars`
- **Cache intelligente**: TTL, tag custom, invalidazione, metodi avanzati
- **Worker asincroni**: esecuzione di task pesanti in Web Worker, API semplificata
- **Estensioni prototype**: Array, String, Object, JSON potenziati a runtime e type-safe
- **Event bus globale**: publish/subscribe cross-component, custom event
- **Decorator applicativi**: tracing, permessi, lifecycle, logging
- **Utility grafiche**: SVG, canvas, immagini, download, conversioni
- **Mock e testing**: interceptor automatico, override di window.alert, strumenti per test/debug
- **Configurazione enterprise**: policy browser, override log, multi-browser, documentazione dettagliata

---

## 📦 Installazione

```bash
npm i pl-core-utils-library
```

---

## 🛠️ Setup modulo

### Configurazione base

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlCoreModule } from 'pl-core-utils-library';

@NgModule({
  imports: [
    BrowserModule,
    PlCoreModule
  ]
})
export class AppModule {}
```

### Configurazione avanzata (`forRoot`)

```ts
import { PlCoreModule, BROWSER } from 'pl-core-utils-library';

@NgModule({
  imports: [
    PlCoreModule.forRoot({
      browserValid: [BROWSER.CHROME, BROWSER.EDGE, BROWSER.FIREFOX],
      disableLog: false,
      maxCacheAge: 300000,
      cacheTag: '@cachable@',
      mockPath: 'public/mock',
      enableAlert: true
    })
  ]
})
export class AppModule {}
```

---


## 🧩 API e servizi principali

---

## 📝 Come creare parametri complessi per le funzioni

Molte funzioni della libreria accettano oggetti complessi come parametri. Di seguito alcuni esempi pratici e pattern consigliati per costruire e tipizzare correttamente questi oggetti.

### PlHttpRequest e chiamate HTTP

```ts
import { PlHttpRequest, PlHttpRequestConfig } from 'pl-core-utils-library';

const params = {
  url: '/api/users',
  method: 'POST',
  queryParams: { page: 1, size: 20 },
  httpHeaders: { Authorization: 'Bearer token' },
  body: { name: 'Mario', roles: ['ADMIN', 'USER'] },
  mocked: false
} satisfies PlHttpRequestConfig;

const req = new PlHttpRequest(params);
// oppure factory:
const req2 = PlHttpRequest.post({ url: '/api/users', body: { name: 'Mario' } });
```

### Parametri per ricerca binaria (PlBinaryFindInput)

```ts
import { PlBinaryFindInput } from 'pl-core-utils-library';

const input: PlBinaryFindInput<number> = {
  arr: [10, 20, 30, 40],
  searchElement: 30
};
const idx = await utils.binaryFind(input);
```

### Parametri per worker asincroni

```ts
const data = { a: 5, b: 7, options: { verbose: true } };
this.worker.run((input) => input.a + input.b, 'sum', undefined, data);
```

### Oggetti JSON complessi per utility e prototype

```ts
const complexJson = {
  user: {
    id: 1,
    profile: { name: 'Luca', skills: ['TS', 'Angular'] },
    active: true
  },
  settings: { theme: 'dark', lang: 'it' }
};
const flat = JSON.json2flat(complexJson);
```

### Tipizzazione e best practice

- Usa sempre le interfacce esportate dalla libreria (`PlHttpRequestConfig`, `PlBinaryFindInput`, ecc.) per tipizzare i parametri.
- Per oggetti annidati, definisci interfacce custom se necessario:
  ```ts
  interface MyUser {
    id: number;
    name: string;
    roles: string[];
  }
  const user: MyUser = { id: 1, name: 'Luca', roles: ['ADMIN'] };
  ```
- Per funzioni che accettano callback, tipizza sempre i parametri della callback:
  ```ts
  this.utils.startTraceSizeWindow((size: PlWindowSize) => {
    console.log(size.W, size.h);
  });
  ```

---

### Chiamate HTTP con progress bar e mock

```ts
import { PlHttpService, PlHttpRequest, RESPONSE_TYPE, PlCoreUtils } from 'pl-core-utils-library';

const req = PlHttpRequest.get({ url: '/api/files/big-download' });
this.http.GET(req, RESPONSE_TYPE.BLOB, undefined, undefined, (idAjax) => {
  PlCoreUtils.progressBars[idAjax].changed.subscribe(progress => {
    console.log(progress.percent, progress.loaded, progress.size);
  });
  // Interrompi download
  // PlCoreUtils.progressBars[idAjax].interrupt.next(true);
});
```

### Stream JSON incrementale

```ts
const req = PlHttpRequest.post({ url: '/api/stream/events', body: { topic: 'audit' } });
this.http.STREAM<any>(req).subscribe({
  next: item => console.log('chunk', item),
  error: err => console.error(err),
  complete: () => console.log('done')
});
```

### Download e gestione blob

```ts
this.http.DOWNLOAD(arrayBufferData, CONTENT_TYPE.PDF, 'report.pdf');
this.http.CREATEBLOB(arrayBufferData, CONTENT_TYPE.PDF)
  .then(url => this.http.DOWNLOADURL(url, 'file.pdf'));
```

### Cache avanzata

```ts
this.cache.set('users:page1', users, 60000);
const cached = this.cache.get<User[]>('users:page1');
```

### Worker asincroni

```ts
this.worker.run((input) => input.a + input.b, 'sum', undefined, { a: 1, b: 2 }).then(console.log);
```

### Event bus globale

```ts
PlCoreUtils.Broadcast().listenEvent('APP:READY', (event) => console.log(event.detail));
PlCoreUtils.Broadcast().execEvent('APP:READY', { ok: true });
```

### Decorator applicativi

```ts
@PLTraceMethod()
myMethod() { ... }

@PLTraceHooks(['ngOnDestroy'])
export class MyComponent { ... }
```


### Estensioni prototype (Array, String, Object, JSON) e Array asincroni


**Array**
```ts
const arr = [1,2,3];
arr.moveUp(2); // Sposta il 3 in posizione 1
arr.insert(1, 99); // [1,99,2,3]
arr.differences([1,2]); // [3]
```

**Array asincroni e reattivi (ToAsyncIterator)**

Le API di `ToAsyncIterator.ts` sono ora patchate automaticamente su tutti gli array: non serve importarle manualmente.

- `toAsyncIterator(options?)`: trasforma l'array in un iteratore asincrono che emette elementi e mutazioni live.
- `toReactiveArray()`: restituisce un Proxy che notifica le mutazioni.
- `onArrayChange(listener)`: registra un listener per le mutazioni.

**Esempi pratici:**

```ts
// Iterazione asincrona con delay tra gli elementi
const arr = [1,2,3].toReactiveArray();
for await (const item of arr.toAsyncIterator({ delayMs: 250 })) {
  console.log(item);
}

// Ascolto mutazioni
const unsubscribe = arr.onArrayChange(change => {
  console.log('Mutazione:', change.type, change);
});
arr.push(4); // triggera il listener
unsubscribe();

// Reactive array: ogni mutazione notifica i listener
const reactive = [10, 20].toReactiveArray();
reactive[0] = 99; // notifica 'set'
reactive.push(30); // notifica 'push'
```

**Nota:** tutte queste estensioni sono disponibili automaticamente importando la libreria, senza bisogno di import espliciti di ToAsyncIterator.

**String**
```ts
"Ciao {0} {1}".format("Luca", "Piciollo"); // "Ciao Luca Piciollo"
"".isNullOrEmpty(""); // true
```

**Object**
```ts
const copy = obj.clone();
const changed = obj.changeValues([null, ''], 0);
```

**JSON**
```ts
const flat = JSON.json2flat({ a: { b: 1 } }); // [{ key: 'a.b', value: 1 }]
```

---

## 📚 Documentazione dettagliata e best practice

Consulta la sezione "Documentazione dettagliata funzioni principali" qui sotto per API, parametri, return, esempi e pattern di utilizzo avanzati per ogni servizio, utility, decorator e prototype extension.

---

## pl-utils.service.ts

### binaryFind
```ts
binaryFind<T = any>(input: PlBinaryFindInput<T>): Promise<number>
```
Ricerca dicotomica asincrona in un array ordinato.
- **Parametri:**
  - `input`: `{ arr: T[], searchElement: T }` — Array ordinato e valore da cercare.
- **Ritorna:** Promise con indice trovato o `-1`.
- **Esempio:**
```ts
await utils.binaryFind({ arr: [1,2,3], searchElement: 2 }); // 1
```

### binaryFindSync
```ts
binaryFindSync<T = any>(input: PlBinaryFindInput<T>): number
```
Ricerca dicotomica sincrona in un array ordinato.
- **Parametri:** come sopra.
- **Ritorna:** Indice trovato o `-1`.

### traceSizeWindow
```ts
traceSizeWindow(): Observable<PlWindowSize>
```
Osserva le dimensioni della finestra browser (W, h).
- **Ritorna:** Observable con dimensione corrente.

### startTraceSizeWindow
```ts
startTraceSizeWindow(callback: (size: PlWindowSize) => void): Subscription
```
Avvia il trace del resize con callback.
- **Parametri:** callback chiamata a ogni resize.
- **Ritorna:** Subscription.

### stopTraceSizeWindow
```ts
stopTraceSizeWindow(): void
```
Ferma il trace del resize.

---

## pl-ambient-mode.service.ts (runtime prototype extension)

Estende a runtime i seguenti metodi su Array, String, Object, JSON (vedi sezione Estensioni Prototipi sopra per dettagli e firme):
- `Array.moveDown`, `Array.moveTo`, `Array.moveUp`, `Array.delete`, `Array.insert`, `Array.differences`, `Array.inArray`,
- `String.format`, `String.isNullOrEmpty`,
- `Object.clone`, `Object.changeValues`, `Object.PROXY`,
- `JSON.changeValues`, `JSON.changeValuesByKey`, `JSON.findKey`, `JSON.findByValue`, `JSON.findByKeyAndValue`, `JSON.json2flat`, `JSON.json2array`, `JSON.json2flatObj`, `JSON.deleteKey`

### detect
```ts
detect(): { browser: string, supported: boolean, ... }
```
Rileva browser e ambiente, applica policy e patch.
- **Ritorna:** Info browser e supporto.

---

## pl-http.service.ts

### requestOption
```ts
requestOption(...): { ... }
```
Costruisce le opzioni per una richiesta HTTP (headers, params, ecc.).
- **Parametri:** vedi sorgente.
- **Ritorna:** Oggetto opzioni per Angular HttpClient.

---

## pl-network.service.ts

### getLocalHttpHeaders
```ts
getLocalHttpHeaders(): Promise<PlLocalHttpInfo>
```
Recupera header e query params della pagina corrente.
- **Ritorna:** Promise con `{ headers, params }`.

---

## pl-graphic.service.ts

### image2base64
```ts
image2base64(imageUrl: string): Promise<string>
```
Converte un SVG da URL in base64.
- **Parametri:** `imageUrl` — URL SVG.
- **Ritorna:** Promise con data URL base64.

### svg2File
```ts
svg2File(elementSVG: HTMLElement | SVGElement, nameFile: string): Observable<boolean>
```
Esporta un elemento SVG in file .svg.
- **Parametri:** elemento SVG/HTML, nome file.
- **Ritorna:** Observable che emette `true` a completamento.

### svgToJpeg
```ts
svgToJpeg(elementSVG: HTMLElement | SVGElement): Observable<string>
```
Converte SVG/HTML in JPEG (base64).
- **Parametri:** elemento SVG/HTML.
- **Ritorna:** Observable con data URL JPEG.

### domToCanvas
```ts
domToCanvas(element: HTMLElement, call?: (canvas: HTMLCanvasElement) => void): void
```
Converte un DOM in canvas.
- **Parametri:** elemento DOM, callback opzionale.

### canvasToImg
```ts
canvasToImg(canvas: HTMLCanvasElement): Observable<string>
```
Converte un canvas in immagine base64.
- **Parametri:** canvas.
- **Ritorna:** Observable con data URL.

### svgToImage
```ts
svgToImage(element: SVGElement, call?: (img: HTMLImageElement) => void): void
```
Converte SVG in immagine.
- **Parametri:** elemento SVG, callback opzionale.

---

## pl-cache-map.service.ts

### set
```ts
set<T = any>(key: string, value: T, maxAge?): void
```
Salva un valore in cache.
- **Parametri:** chiave, valore, durata opzionale.

### get
```ts
get<T = any>(key: string): T | null
```
Recupera valore dalla cache.
- **Parametri:** chiave.
- **Ritorna:** valore o null.

### has
```ts
has(key: string): boolean
```
Verifica presenza e validità di una chiave.

### delete
```ts
delete(key: string): void
```
Rimuove una chiave dalla cache.

### clear
```ts
clear(): void
```
Svuota la cache.

### keys
```ts
keys(): string[]
```
Elenco chiavi presenti.

### size
```ts
size(): number
```
Numero elementi in cache.

### hasCacheTag
```ts
hasCacheTag(url: string): boolean
```
Verifica presenza tag cache in una URL.

### removeCacheTag
```ts
removeCacheTag(url: string): string
```
Rimuove tag cache dalla URL.

---

## pl-core-utils-library.service.ts

### Broadcast
```ts
static Broadcast(): { execEvent, listenEvent, removeListenEvent, ... }
```
Event bus per publish/subscribe custom event.
- **Esempio:**
```ts
PlCoreUtils.Broadcast().listenEvent('APP:READY', (event) => ...);
PlCoreUtils.Broadcast().execEvent('APP:READY', { ok: true });
```

---

## pl-worker.service.ts

### run
```ts
run<T = any>(workerFunction, nameThred, initProcess?, data?, singolInstance?): Promise<T>
```
Esegue funzione in Web Worker (se supportato).
- **Parametri:** funzione, nome thread, callback opzionale, dati opzionali, istanza singola opzionale.
- **Ritorna:** Promise con risultato.

### runUrl
```ts
runUrl<T = any>(url: string, data?: any): Promise<T>
```
Esegue worker da URL.

### getWorker
```ts
getWorker<T = any>(promise: Promise<T>): Worker | undefined
```
Recupera worker associato a una promise.

### terminateWorker
```ts
terminateWorker<T = any>(promise: Promise<T>): void
```
Termina worker associato.

---

## pl-interceptor-mock.service.ts

### intercept
```ts
intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
```
Se header `mocked: true`, trasforma la request in GET verso file JSON mock.

---

## pl-core-utils-library.module.ts

### forRoot
```ts
static forRoot(config: PlCoreModuleConfig = {}): ModuleWithProviders<PlCoreModule>
```
Configura il modulo con opzioni custom.

### Routing
```ts
static Routing(): { getIinterrupt(): Subject<boolean> }
```
Gestione interrupt di routing.

---

## pl-uuid.util.ts

### createPlUuid
```ts
createPlUuid(): string
```
Genera un UUID v4 sicuro (usa crypto.randomUUID se disponibile).

---

## decorator/decordator.ts

### PLTraceMethod
```ts
PLTraceMethod(): MethodDecorator
```
Logga input/output/error del metodo decorato.

### PLTraceHooks
```ts
PLTraceHooks(disabled: Array<string> = []): ClassDecorator
```
Logga i lifecycle Angular della classe decorata.

### PLPermission
```ts
PLPermission(enabled = true): ClassDecorator
```
Applica controlli permesso su elementi DOM con attributo `PL-permission`.

---

## bean/Pl-http-request.ts

### get/post/put/patch/delete
```ts
static get(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest
static post(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest
static put(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest
static patch(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest
static delete(config: Omit<PlHttpRequestConfig, 'method'> = {}): PlHttpRequest
```
Factory per richieste HTTP tipizzate.

### normalizeMethod
```ts
static normalizeMethod(method?: PlHttpMethod | string): PlHttpMethod
```
Normalizza e valida il metodo HTTP.

### isValidMethod
```ts
static isValidMethod(method: string): method is PlHttpMethod
```
Verifica se il metodo passato è supportato.

### clone
```ts
clone(config: PlHttpRequestConfig = {}): PlHttpRequest
```
Clona la richiesta sovrascrivendo i campi specificati.

### withHeaders/withQueryParams/withBody/withMocked
```ts
withHeaders(httpHeaders): PlHttpRequest
withQueryParams(queryParams): PlHttpRequest
withBody(body): PlHttpRequest
withMocked(mocked = true): PlHttpRequest
```
Restituisce una clone con i campi aggiornati.
# pl-core-utils-library

Libreria Angular con utilità core per:

- chiamate HTTP con progress e interrupt
- cache lato client con TTL
- mock automatico via interceptor
- utility browser/ambiente
- utility grafiche (canvas, svg, download)
- worker in background
- decorator applicativi
- base component condiviso

## Requisiti

- Angular 19+
- RxJS 7+

## Installazione

```bash
npm i pl-core-utils-library
```

## Setup modulo

### Configurazione base

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlCoreModule } from 'pl-core-utils-library';

@NgModule({
  imports: [
    BrowserModule,
    PlCoreModule
  ]
})
export class AppModule {}
```

### Configurazione consigliata (`forRoot`)

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlCoreModule, BROWSER } from 'pl-core-utils-library';

@NgModule({
  imports: [
    BrowserModule,
    PlCoreModule.forRoot({
      browserValid: [BROWSER.CHROME, BROWSER.EDGE, BROWSER.FIREFOX],
      disableLog: false,
      maxCacheAge: 300000,
      cacheTag: '@cachable@',
      mockPath: 'public/mock',
      enableAlert: true
    })
  ]
})
export class AppModule {}
```

## API pubbliche esposte

La libreria esporta da `public-api.ts`:

### Modulo

- `PlCoreModule`
- `PlCoreModuleConfig`
- `PL_CORE_MODULE_CONFIG`

### Componenti

- `AlertComponent`
- `PlBaseComponent`

### Servizi

- `AlertService`
- `PlAmbientModeLoaderService`
- `PlCacheMapService`
- `PlGraphicService`
- `PlHttpService`
- `PlNetworkService`
- `PlUtilsService`
- `PLWorkerService`

### Interceptor e token

- `PlHttpInterceptorMockService`
- `DEFAULT_PATH_MOCK`

### Utility, tipi e bean

- `PlCoreUtils`
- `PlProgressBar`
- `progressBarItemInterface` (deprecated)
- `progressBarsInterface`
- `PlBroadcastEventListener`
- `createPlUuid`
- `PlHttpRequest`
- `PlHttpMethod`
- `PlHttpRequestConfig`

### Enum e costanti

- `TYPE_EVENT_NETWORK`
- `RESPONSE_TYPE`
- `CONTENT_TYPE`
- `BROWSER`
- `BROWSER_VALID`
- `DISABLE_LOG`
- `MAX_CACHE_AGE`
- `CACHE_TAG`

### Decorator

- `PLPermission`
- `PLTraceHooks`
- `PLTraceMethod`
- `TYPE_EVENT`

## Configurazione dettagliata

### Cache HTTP

La cache è gestita dal servizio `PlCacheMapService`.

- `CACHE_TAG`: tag da includere nella URL per considerare una request “cacheabile”
- `MAX_CACHE_AGE`: durata in millisecondi della cache

Esempio URL cacheabile:

```ts
const url = '@cachable@/api/anagrafica/clienti';
```

### Browser ambient mode

`PlAmbientModeLoaderService` usa:

- `BROWSER_VALID`: browser consentiti
- `DISABLE_LOG`: disabilita `console.log`

Uso:

```ts
constructor(private ambient: PlAmbientModeLoaderService) {}

ngOnInit(): void {
  const result = this.ambient.detect();
  console.log(result.browser, result.supported);
}
```

### Mock interceptor

Con header `mocked: true`, l’interceptor converte la request in:

`/assets/{mockPath}/{url-path}/{method}.json`

Esempio:

- request: `GET /api/users` con `mocked: true`
- path mock: `public/mock`
- file letto: `/assets/public/mock/api/users/get.json`

## Uso di `PlHttpRequest`

```ts
import { PlHttpRequest } from 'pl-core-utils-library';

const request = new PlHttpRequest({
  url: '/api/users',
  method: 'GET',
  queryParams: { page: 1, size: 20 },
  httpHeaders: { Authorization: 'Bearer token' },
  mocked: false
});
```

Factory statiche:

```ts
PlHttpRequest.get({ url: '/api/users' });
PlHttpRequest.post({ url: '/api/users', body: { name: 'Mario' } });
PlHttpRequest.put({ url: '/api/users/1', body: { name: 'Mario Rossi' } });
PlHttpRequest.patch({ url: '/api/users/1', body: { active: true } });
PlHttpRequest.delete({ url: '/api/users/1' });
```

## Uso di `PlHttpService`

### GET / POST / PATCH / PUT / DELETE

```ts
import { RESPONSE_TYPE, PlHttpRequest } from 'pl-core-utils-library';

const req = PlHttpRequest.get({
  url: '/api/users',
  queryParams: { page: 1 }
});

this.http.GET(req, RESPONSE_TYPE.JSON).subscribe({
  next: (event) => console.log(event),
  error: (err) => console.error(err)
});
```

### Monitor progress + interrupt

```ts
const req = PlHttpRequest.get({ url: '/api/files/big-download' });

this.http.GET(req, RESPONSE_TYPE.BLOB, undefined, undefined, (idAjax) => {
  PlCoreUtils.progressBars[idAjax].changed.subscribe(progress => {
    console.log(progress.percent, progress.loaded, progress.size);
  });

  // eventuale stop manuale
  // PlCoreUtils.progressBars[idAjax].interrupt.next(true);
});
```

### Stream JSON incrementale

```ts
const req = PlHttpRequest.post({
  url: '/api/stream/events',
  body: { topic: 'audit' }
});

this.http.STREAM<any>(req).subscribe({
  next: item => console.log('chunk', item),
  error: err => console.error(err),
  complete: () => console.log('done')
});
```

### Download e blob

```ts
this.http.DOWNLOAD(arrayBufferData, CONTENT_TYPE.PDF, 'report.pdf');

this.http.CREATEBLOB(arrayBufferData, CONTENT_TYPE.PDF)
  .then(url => this.http.DOWNLOADURL(url, 'file.pdf'));
```

## `PlCacheMapService`

Metodi principali:

- `set(key, value, maxAge?)`
- `get(key)`
- `has(key)`
- `delete(key)`
- `clear()`
- `keys()`
- `size()`
- `hasCacheTag(url)`
- `removeCacheTag(url)`

Esempio:

```ts
this.cache.set('users:page1', users, 60000);
const cached = this.cache.get<User[]>('users:page1');
```

## `PlGraphicService`

Metodi principali:

- `image2base64(imageUrl)`
- `svg2File(elementSVG, nameFile)`
- `svgToJpeg(elementSVG)`
- `domToCanvas(elementoDom, call?)`
- `canvasToImg(canvas)`
- `svgToImage(svgElement, call?)`

Esempio:

```ts
this.graphic.svgToJpeg(this.svgRef.nativeElement).subscribe(dataUrl => {
  console.log('jpeg base64', dataUrl);
});
```

## `PLWorkerService`

Esegue funzioni in Web Worker quando disponibili.

```ts
const promise = this.worker.run<number>(
  (input) => {
    let total = 0;
    for (let i = 0; i < input.max; i++) total += i;
    return total;
  },
  'sum-worker',
  console.log,
  { max: 5_000_000 }
);

promise.then(result => console.log(result));
```

Metodi utili:

- `run(workerFunction, nameThread, initProcess?, data?, singolInstance?)`
- `runUrl(url, data?)`
- `getWorker(promise)`
- `terminateWorker(promise)`

## `PlUtilsService`

- `binaryFind(input)`
- `binaryFindSync(input)`
- `traceSizeWindow()`
- `startTraceSizeWindow(callback)`
- `stopTraceSizeWindow()`

Esempio:

```ts
this.utils.traceSizeWindow().subscribe(size => {
  console.log(size.W, size.h);
});
```

## `PlNetworkService`

Recupera info locali HTTP/URL:

```ts
this.network.getLocalHttpHeaders().then(info => {
  console.log(info.headers, info.params);
});
```

## `PlCoreUtils.Broadcast()`

Event bus basato su `CustomEvent`:

```ts
PlCoreUtils.Broadcast().listenEvent('APP:READY', (event) => {
  console.log(event.detail);
});

PlCoreUtils.Broadcast().execEvent('APP:READY', { ok: true });
```

## `AlertService` e override di `window.alert`

Quando abilitato, `AlertService` intercetta `window.alert(...)` e mostra il messaggio via `AlertComponent`.

```ts
constructor(private alertService: AlertService) {}

ngOnInit(): void {
  this.alertService.enableAlertMessage(true);
  window.alert('Titolo', 'Messaggio custom');
}
```

## Decorator disponibili

### `@PLTraceMethod()`

Logga input/output/error del metodo decorato.

### `@PLTraceHooks(disabled?)`

Logga lifecycle Angular della classe decorata.

### `@PLPermission(enabled?)`

Ascolta evento `PL:SET-PERMISSION` e rimuove elementi DOM con attributo `PL-permission` non autorizzato.

Esempio evento:

```ts
document.dispatchEvent(new CustomEvent('PL:SET-PERMISSION', {
  detail: ['ADMIN', 'READONLY']
}));
```

Esempio DOM:

```html
<input PL-permission="READONLY|ADMIN" />
```


---

# 📚 Documentazione API e Utilizzo Dettagliato

Questa sezione fornisce una panoramica professionale e dettagliata di tutte le funzioni, servizi, estensioni dei prototipi, decorator, bean e componenti principali della libreria, con esempi pratici e spiegazione dei parametri.

## Estensioni dei Prototipi (Array, String, Object, JSON)

### Array

- `moveDown(from: number): void` — Sposta l'elemento di una posizione verso il basso.
- `moveTo(from: number, to: number): void` — Sposta l'elemento da un indice a un altro.
- `moveUp(from: number): void` — Sposta l'elemento di una posizione verso l'alto.
- `delete(position: number): void` — Elimina l'elemento nella posizione indicata.
- `insert(index: number, item: T): void` — Inserisce un elemento nella posizione indicata.
- `differences(items: T[]): T[]` — Ritorna gli elementi presenti nell'array corrente ma non in quello passato.
- `inArray(item: T): number` — Ritorna l'indice dell'elemento se presente, altrimenti -1.
- `simpleDisposition(k: number): Generator<T[]>` — Disposizioni semplici di classe k (ordine importante, senza ripetizione).
- `simpleCombine(k: number): Generator<T[]>` — Combinazioni semplici di classe k (ordine non importante, senza ripetizione).

**Esempio:**
```ts
const arr = [1,2,3];
arr.moveUp(2); // Sposta il 3 in posizione 1
```

### String

- `format(...params): string` — Sostituisce i placeholder `{0}`, `{1}` ecc. con i parametri.
- `isNullOrEmpty(val): boolean` — Controlla se la stringa è null, undefined o vuota.
- `truncateUrlIfNoParams(val?): string` — Tronca la URL prima del `?` se val non è valorizzato.
- `truncateUrlCache(cachableTag: string): string` — Rimuove dalla stringa il tag cache passato.

**Esempio:**
```ts
"Ciao {0} {1}".format("Luca", "Piciollo"); // "Ciao Luca Piciollo"
```

### Object

- `clone<T>(): T` — Clona profondamente l'oggetto.
- `changeValues(currentValues, newValue, ignore?)` — Cambia ricorsivamente i valori dell'oggetto.
- `PROXY(replaceWith?, proxy?, ignore?)` — Crea un proxy ricorsivo dell'oggetto.

### JSON

- `changeValues(json, previousValue, nextValue, ignore?)` — Cambia ricorsivamente tutti i valori uguali a previousValue.
- `changeValuesByKey(json, key, nextValue, ignore?)` — Cambia ricorsivamente il valore delle proprietà con chiave uguale a key.
- `findKey(json, keyFind, ignore?, stopOnFirst?)` — Cerca ricorsivamente una chiave.
- `findByValue(json, value, ignore?, stopOnFirst?)` — Cerca ricorsivamente un valore.
- `findByKeyAndValue(json, keyFind, valueFind, ignore?, stopOnFirst?)` — Cerca ricorsivamente una coppia chiave/valore.
- `json2flat(json, ignore?)` — Converte un JSON in lista flat `{ key, value }`.
- `json2array(json, ignore?)` — Converte un JSON in array key/value senza path completo.
- `json2flatObj(data, ignore?)` — Converte un oggetto in oggetto flat `{ "a.b.c": 1 }`.
- `deleteKey(source, keys)` — Cancella chiavi per nome.
- `deleteKey(source, keys, valueToMatch)` — Cancella chiavi per nome solo se hanno uno specifico valore.
- `deleteKey(source, null, valueToMatch)` — Cancella tutte le chiavi che hanno quel valore.

**Esempio:**
```ts
const obj = { a: { b: { c: 1 } } };
const flat = JSON.json2flat(obj); // [{ key: "a.b.c", value: 1 }]
```

---

## Servizi e Utility Principali

### PlUtilsService

- `binaryFind(input: PlBinaryFindInput): Promise<number>` — Ricerca dicotomica asincrona in array ordinato.
- `binaryFindSync(input: PlBinaryFindInput): number` — Ricerca dicotomica sincrona.
- `traceSizeWindow(): Observable<PlWindowSize>` — Osserva le dimensioni della finestra.
- `startTraceSizeWindow(callback)` — Avvia il trace del resize con callback.
- `stopTraceSizeWindow()` — Ferma il trace del resize.

**Esempio:**
```ts
this.utils.binaryFind({ arr: [1,2,3], searchElement: 2 }).then(idx => console.log(idx));
```

### PlAmbientModeLoaderService

- `detect()` — Rileva browser e ambiente, applica policy e patch.

**Esempio:**
```ts
const info = this.ambient.detect();
console.log(info.browser, info.supported);
```

### PlHttpService

- `GET/POST/PUT/PATCH/DELETE(request, responseType, ...)` — Chiamate HTTP tipizzate con progress, mock, blob, ecc.
- `STREAM(request)` — Stream JSON incrementale.
- `DOWNLOAD(data, contentType, fileName)` — Download file.
- `CREATEBLOB(data, contentType)` — Crea blob e restituisce URL.
- `DOWNLOADURL(url, fileName)` — Download da URL blob.

**Esempio:**
```ts
this.http.GET(PlHttpRequest.get({ url: '/api' }), RESPONSE_TYPE.JSON).subscribe(...);
```

### PlCacheMapService

- `set(key, value, maxAge?)` — Salva valore in cache.
- `get(key)` — Recupera valore dalla cache.
- `has(key)` — Verifica presenza e validità.
- `delete(key)` — Rimuove chiave.
- `clear()` — Svuota cache.
- `keys()` — Elenco chiavi.
- `size()` — Numero elementi.
- `hasCacheTag(url)` — Verifica presenza tag cache.
- `removeCacheTag(url)` — Rimuove tag cache dalla URL.

**Esempio:**
```ts
this.cache.set('users', users, 60000);
const cached = this.cache.get('users');
```

### PlGraphicService

- `image2base64(imageUrl)` — Converte SVG in base64.
- `svg2File(elementSVG, nameFile)` — Esporta SVG in file.
- `svgToJpeg(elementSVG)` — Converte SVG/HTML in JPEG.
- `domToCanvas(elementoDom, call?)` — Converte DOM in canvas.
- `canvasToImg(canvas)` — Converte canvas in immagine.
- `svgToImage(svgElement, call?)` — Converte SVG in immagine.

**Esempio:**
```ts
this.graphic.svgToJpeg(this.svgRef.nativeElement).subscribe(dataUrl => console.log(dataUrl));
```

### PLWorkerService

- `run(workerFunction, nameThread, initProcess?, data?, singolInstance?)` — Esegue funzione in Web Worker.
- `runUrl(url, data?)` — Esegue worker da URL.
- `getWorker(promise)` — Recupera worker associato a una promise.
- `terminateWorker(promise)` — Termina worker associato.

**Esempio:**
```ts
this.worker.run((input) => input.a + input.b, 'sum', undefined, { a: 1, b: 2 }).then(console.log);
```

### PlNetworkService

- `getLocalHttpHeaders()` — Recupera header e query params della pagina.

**Esempio:**
```ts
this.network.getLocalHttpHeaders().then(info => console.log(info.headers, info.params));
```

### PlCoreUtils

- `progressBars` — Stato avanzamento download/upload.
- `Broadcast()` — Event bus per publish/subscribe custom event.

**Esempio:**
```ts
PlCoreUtils.Broadcast().listenEvent('APP:READY', (event) => console.log(event.detail));
PlCoreUtils.Broadcast().execEvent('APP:READY', { ok: true });
```

### AlertService & AlertComponent

- `enableAlertMessage(enable: boolean)` — Abilita/disabilita override di `window.alert`.

**Esempio:**
```ts
this.alertService.enableAlertMessage(true);
window.alert('Titolo', 'Messaggio custom');
```

---

## Decorator Applicativi

- `@PLTraceMethod()` — Logga input/output/error del metodo decorato.
- `@PLTraceHooks(disabled?)` — Logga i lifecycle Angular della classe decorata.
- `@PLPermission(enabled?)` — Applica controlli permesso su elementi DOM con attributo `PL-permission`.

**Esempio:**
```ts
@PLTraceMethod()
myMethod() { ... }

@PLTraceHooks(['ngOnDestroy'])
export class MyComponent { ... }
```

---

## Bean e Tipi Principali

- `PlHttpRequest` — Modello richiesta HTTP con factory statiche (`get`, `post`, `put`, `patch`, `delete`), metodi di clone e modifica.
- `PlHttpRequestConfig` — Configurazione richiesta HTTP.
- `PlHttpMethod` — Tipo metodo HTTP.
- `PlProgressBar`, `progressBarsInterface` — Stato avanzamento download/upload.
- `ErrorBean`, `ErrorCode` — Bean e enum per gestione errori applicativi.

**Esempio:**
```ts
const req = PlHttpRequest.post({ url: '/api', body: { x: 1 } });
const err = new ErrorBean('Errore di sistema', ErrorCode.SYSTEMERRORCODE);
```

---

## Funzione Utility

- `createPlUuid()` — Genera un UUID v4 sicuro.

**Esempio:**
```ts
const uuid = createPlUuid();
```

---

## Note operative

- Alcune utility usano API browser (`window`, `document`, `XMLHttpRequest`) e non sono adatte a runtime server-side.
- I metodi HTTP con `responseType` abilitano progress e tracciamento in `PlCoreUtils.progressBars`.
- Il modulo include già `PlHttpInterceptorMockService`.

## Changelog e versionamento

Per processi di build/pack/publish usa gli script presenti nella root del workspace (`build:lib`, `pack:lib`, `verify:lib`, `publish:lib:*`).
