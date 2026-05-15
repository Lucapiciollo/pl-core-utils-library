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

## Note operative

- Alcune utility usano API browser (`window`, `document`, `XMLHttpRequest`) e non sono adatte a runtime server-side.
- I metodi HTTP con `responseType` abilitano progress e tracciamento in `PlCoreUtils.progressBars`.
- Il modulo include già `PlHttpInterceptorMockService`.

## Changelog e versionamento

Per processi di build/pack/publish usa gli script presenti nella root del workspace (`build:lib`, `pack:lib`, `verify:lib`, `publish:lib:*`).
