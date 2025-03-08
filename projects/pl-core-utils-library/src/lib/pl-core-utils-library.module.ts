import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
 import { BROWSER, BROWSER_VALID, DISABLE_LOG, PlAmbientModeLoaderService } from './service/pl-ambient-mode.service';
import { CACHE_TAG, MAX_CACHE_AGE } from './service/pl-cache-map.service';
import { DEFAULT_PATH_MOCK, PlHttpInterceptorMockService } from './interceptor/pl-interceptor-mock.service';
import { AlertComponent } from './component/alert/alert.component';
import { AlertService } from './component/alert/alert.service';
import { PlBaseComponent } from './component/base-component/pl-base-component.component';



@NgModule({
  declarations: [  AlertComponent, PlBaseComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule ,
  ],
  exports: [HttpClientModule, PlBaseComponent,CommonModule],
  providers: [
    PlAmbientModeLoaderService,
    /**
     * @author l.piciollo
     * configurazione per il servizio dei caching
     */
    { provide: BROWSER_VALID, useValue: [BROWSER.ALL] },
    { provide: DISABLE_LOG, useValue: false },
    { provide: MAX_CACHE_AGE, useValue: 300000 },
    { provide: CACHE_TAG, useValue: "@cachable@" },
    /**
     * configurazione intercettore per servizi mock
     */
    { provide: HTTP_INTERCEPTORS, useClass: PlHttpInterceptorMockService, multi: true },
    /**
     * inizializzazione del path per reperire gli stub json di risposta al mock 
     */
    { provide: DEFAULT_PATH_MOCK, useValue: "public/mock" }

    //{ provide: APP_INITIALIZER, useFactory: PlAmbientModeLoaderService, deps: [ ], multi: true }
  ]
  //, entryComponents: [ AlertComponent]
})
/**
 * @author l.piciollo
 * modulo di inizializzazione della libreria, occorre importare questo modulo affinche le funzionalita vengano attivate.
 * il modulo esporta una funzionalità per reperire un interrupt da passare alle http in caso di cambio rotta
 * @example 
 *       imports :[PlCoreModule]
 *       providers: [{ provide: APP_INITIALIZER, useFactory: PlAmbientModeLoaderService, deps: [ ], multi: true }]
 * 
 *   per reperire il cambio rotta
 *       PlCoreModule.Routing().getIinterrupt()   
 */
export class PlCoreModule {
  private static interrupter: Subject<boolean> = new Subject<boolean>();
  /**
   * al momento della costruzione del modulo.. viene creato un intercettore di cambio rotta NavigationStart
   * @param plAmbientModeLoaderService 
   * @param router 
   */
  constructor(private alertService: AlertService, private plAmbientModeLoaderService: PlAmbientModeLoaderService, private router: Router  ) {
    try {

 

      this.alertService.enableAlertMessage(true);
      
      router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(event => {
        PlCoreModule.interrupter.next(true)
      });
    } catch (e) {
      console.error(e)
    }
  }
  /**
   * funzionalità per il reperimento del'intercettore di rotta.. in caso di NavigationStart, viene lanciato questo 
   * subject. utile per terminare le richieste http
   */
  static Routing() {
    return {
      getIinterrupt(): Subject<boolean> {
        return PlCoreModule.interrupter;
      }
    }
  }

}
