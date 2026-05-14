import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, OnDestroy, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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

    /**
     * Configurazione per il servizio di caching.
     */
    { provide: BROWSER_VALID, useValue: [BROWSER.ALL] },
    { provide: DISABLE_LOG, useValue: false },
    { provide: MAX_CACHE_AGE, useValue: 300000 },
    { provide: CACHE_TAG, useValue: '@cachable@' },

    /**
     * Configurazione intercettore per servizi mock.
     */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PlHttpInterceptorMockService,
      multi: true
    },

    /**
     * Path per reperire gli stub JSON di risposta al mock.
     */
    { provide: DEFAULT_PATH_MOCK, useValue: 'public/mock' }
  ]
})
export class PlCoreModule implements OnDestroy {
  private static interrupter: Subject<boolean> = new Subject<boolean>();

  private routeEventsSubscription: Subscription | null = null;

  /**
   * Modulo di inizializzazione della libreria.
   *
   * Uso:
   *
   * imports: [PlCoreModule]
   *
   * Per reperire il cambio rotta:
   *
   * PlCoreModule.Routing().getIinterrupt()
   */
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