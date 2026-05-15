/**
 * Per assicurare che le estensioni runtime (metodi su Array, String, Object, JSON) siano disponibili,
 * importa e richiama PlAmbientModeLoaderService nel main.ts del tuo progetto consumer:
 *
 *   import { PlAmbientModeLoaderService } from 'pl-core-utils-library';
 *   // Nel costruttore principale o in APP_INITIALIZER:
 *   plAmbientModeLoaderService.detect().subscribe();
 *
 * Così le estensioni saranno attive a runtime per tutto il progetto.
 */
// Prototype Extensions (estensioni globali)
export * from './prototype-extensions';

import './lib/utils/pl-to-async-iterator';

 
/*
 * Public API Surface of pl-core-utils-library
 */
 

// Module
export {
  PlCoreModule,
  PlCoreModuleConfig,
  PL_CORE_MODULE_CONFIG
} from './lib/pl-core-utils-library.module';

// Components
export { AlertComponent } from './lib/component/alert/alert.component';
export { PlBaseComponent } from './lib/component/base-component/pl-base-component.component';

// Services
export { AlertService } from './lib/component/alert/alert.service';

export {
  PlAmbientModeLoaderService,
  BROWSER,
  BROWSER_VALID,
  DISABLE_LOG,
   
} from './lib/service/pl-ambient-mode.service';

export {
  MAX_CACHE_AGE,
  CACHE_TAG,
  PlCacheMapService,
  PlCacheItem
} from './lib/service/pl-cache-map.service';

export { PlGraphicService } from './lib/service/pl-graphic.service';

export {
  PlHttpService,
  RESPONSE_TYPE,
  CONTENT_TYPE,
  TYPE_EVENT_NETWORK
} from './lib/service/pl-http.service';

export {
  PlNetworkService,
  PlLocalHttpInfo
} from './lib/service/pl-network.service';

export {
  PlUtilsService,
  PlWindowSize,
  PlBinaryFindInput
} from './lib/service/pl-utils.service';

export { PLWorkerService } from './lib/service/pl-worker.service';

// Interceptors
export {
  DEFAULT_PATH_MOCK,
  PlHttpInterceptorMockService
} from './lib/interceptor/pl-interceptor-mock.service';

// Utils
export {
  PlCoreUtils,
  PlProgressBar,
  progressBarItemInterface,
  progressBarsInterface,
  PlBroadcastEventListener
} from './lib/pl-core-utils-library.service';

export { createPlUuid } from './lib/utils/pl-uuid.util';

// Decorators
export {
  PLPermission,
  PLTraceHooks,
  TYPE_EVENT,
  PLTraceMethod
} from './lib/decorator/decordator';

// Beans
export {
  PlHttpRequest,
  PlHttpMethod,
  PlHttpRequestConfig
} from './lib/bean/Pl-http-request';