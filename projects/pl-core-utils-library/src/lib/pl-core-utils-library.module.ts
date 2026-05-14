import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, OnDestroy, Optional, InjectionToken, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface PlCoreModuleConfig {
  browserValid?: BROWSER[];
  disableLog?: boolean;
  maxCacheAge?: number;
  cacheTag?: string;
  mockPath?: string;
}

export const PL_CORE_MODULE_CONFIG = new InjectionToken<PlCoreModuleConfig>(
  'PL_CORE_MODULE_CONFIG'
);


import {
  BROWSER,
  BROWSER_VALID,
  DISABLE_LOG,
  PlAmbientModeLoaderService
} from './service/pl-ambient-mode.service';
import { CACHE_TAG, MAX_CACHE_AGE } from './service/pl-cache-map.service';
import {
  DEFAULT_PATH_MOCK,
  PlHttpInterceptorMockService
} from './interceptor/pl-interceptor-mock.service';
import { AlertComponent } from './component/alert/alert.component';
import { AlertService } from './component/alert/alert.service';
import { PlBaseComponent } from './component/base-component/pl-base-component.component';

@NgModule({
  declarations: [AlertComponent, PlBaseComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  exports: [
    HttpClientModule,
    PlBaseComponent,
    CommonModule
  ],
  providers: [
    PlAmbientModeLoaderService,

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


  constructor(
    private alertService: AlertService,
    private plAmbientModeLoaderService: PlAmbientModeLoaderService,
    @Optional() private router?: Router
  ) {
    try {
      this.alertService.enableAlertMessage(true);

      this.routeEventsSubscription =
        this.router?.events
          .pipe(filter(event => event instanceof NavigationStart))
          .subscribe(() => {
            PlCoreModule.interrupter.next(true);
          }) ?? null;
    } catch (e) {
      console.error(e);
    }
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
}