import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  OnDestroy,
  Optional
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AlertComponent } from './component/alert/alert.component';
import { AlertService } from './component/alert/alert.service';
import { PlBaseComponent } from './component/base-component/pl-base-component.component';
import {
  DEFAULT_PATH_MOCK,
  PlHttpInterceptorMockService
} from './interceptor/pl-interceptor-mock.service';
import {
  BROWSER,
  BROWSER_VALID,
  DISABLE_LOG,
  PlAmbientModeLoaderService
} from './service/pl-ambient-mode.service';
import { CACHE_TAG, MAX_CACHE_AGE } from './service/pl-cache-map.service';

export interface PlCoreModuleConfig {
  browserValid?: BROWSER[];
  disableLog?: boolean;
  maxCacheAge?: number;
  cacheTag?: string;
  mockPath?: string;
  enableAlert?: boolean;
}

export const PL_CORE_MODULE_CONFIG = new InjectionToken<PlCoreModuleConfig>(
  'PL_CORE_MODULE_CONFIG'
);

@NgModule({
  declarations: [
    AlertComponent,
    PlBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    PlBaseComponent
  ],
  providers: [
    PlAmbientModeLoaderService,

    /**
     * Default retrocompatibili.
     * Restano qui per chi usa ancora imports: [PlCoreModule].
     */
    { provide: BROWSER_VALID, useValue: [BROWSER.ALL] },
    { provide: DISABLE_LOG, useValue: false },
    { provide: MAX_CACHE_AGE, useValue: 300000 },
    { provide: CACHE_TAG, useValue: '@cachable@' },
    { provide: DEFAULT_PATH_MOCK, useValue: 'public/mock' },

    /**
     * Intercettore mock storico della libreria.
     */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PlHttpInterceptorMockService,
      multi: true
    }
  ]
})
export class PlCoreModule implements OnDestroy {
  private static interrupter: Subject<boolean> = new Subject<boolean>();

  private routeEventsSubscription: Subscription | null = null;

  static forRoot(config: PlCoreModuleConfig = {}): ModuleWithProviders<PlCoreModule> {
    return {
      ngModule: PlCoreModule,
      providers: [
        {
          provide: PL_CORE_MODULE_CONFIG,
          useValue: config
        },
        {
          provide: BROWSER_VALID,
          useValue: config.browserValid ?? [BROWSER.ALL]
        },
        {
          provide: DISABLE_LOG,
          useValue: config.disableLog ?? false
        },
        {
          provide: MAX_CACHE_AGE,
          useValue: config.maxCacheAge ?? 300000
        },
        {
          provide: CACHE_TAG,
          useValue: config.cacheTag ?? '@cachable@'
        },
        {
          provide: DEFAULT_PATH_MOCK,
          useValue: config.mockPath ?? 'public/mock'
        }
      ]
    };
  }

  /**
   * Modulo di inizializzazione della libreria.
   *
   * Uso base:
   *
   * imports: [PlCoreModule]
   *
   * Uso configurabile:
   *
   * imports: [
   *   PlCoreModule.forRoot({
   *     mockPath: 'assets/mock',
   *     cacheTag: '@cachable@',
   *     maxCacheAge: 300000,
   *     disableLog: false
   *   })
   * ]
   */
  constructor(
    private alertService: AlertService,
    private plAmbientModeLoaderService: PlAmbientModeLoaderService,
    @Optional() private router?: Router
  ) {
    this.initializeAlert();
    this.initializeRoutingInterrupt();
  }

  ngOnDestroy(): void {
    this.routeEventsSubscription?.unsubscribe();
    this.routeEventsSubscription = null;
  }

  /**
   * Funzionalità per il reperimento dell'interrupt di rotta.
   * In caso di NavigationStart viene lanciato il subject.
   * Utile per terminare le richieste HTTP.
   */
  static Routing(): { getIinterrupt(): Subject<boolean> } {
    return {
      getIinterrupt(): Subject<boolean> {
        return PlCoreModule.interrupter;
      }
    };
  }

  private initializeAlert(): void {
    try {
      this.alertService.enableAlertMessage(true);
    } catch (error) {
      console.error(error);
    }
  }

  private initializeRoutingInterrupt(): void {
    if (!this.router) {
      return;
    }

    this.routeEventsSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        PlCoreModule.interrupter.next(true);
      });
  }
}