/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-12-22 16:42:38
 * @modify date 2020-12-22 16:42:38
 * @desc [componente base per l'estensione di componenti.. utile per la condivisione di servizi e funzionalità
 * basilari comuni a tutti i componenti]
 */

import { HttpParams } from '@angular/common/http';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PLTraceHooks, PLUnsubscribe } from '../../decorator/decordator';
import { PlGraphicService } from '../../service/pl-graphic.service';
import { PlHttpService } from '../../service/pl-http.service';
import { PlNetworkService } from '../../service/pl-network.service';
import { PlUtilsService } from '../../service/pl-utils.service';
import { PLWorkerService } from '../../service/pl-worker.service';

@Component({
  template: "",
})

export class PlBaseComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  protected graphicService: PlGraphicService = null;
  protected httpService: PlHttpService = null;
  protected networkService: PlNetworkService = null;
  protected utilsService: PlUtilsService = null;
  protected workerService: PLWorkerService = null;
  protected queryParams: ReplaySubject<any> = new ReplaySubject(1);
  protected params: ReplaySubject<any> = new ReplaySubject(1);
  protected data: ReplaySubject<any> = new ReplaySubject(1);
  protected queryParamsObs: Subscription = null;
  protected paramsObs: Subscription = null;
  protected dataObs: Subscription = null;
  protected router: Router;
  protected route: ActivatedRoute;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.graphicService = this.injector.get(PlGraphicService);
    this.httpService = this.injector.get(PlHttpService);
    this.networkService = this.injector.get(PlNetworkService);
    this.utilsService = this.injector.get(PlUtilsService);
    this.workerService = this.injector.get(PLWorkerService);
    this.paramsObs = this.route.params.subscribe(param => {
      this.params.next(param)
    });
    this.queryParamsObs = this.route.queryParams.subscribe(param => {
      this.queryParams.next(param);
    });
    this.dataObs = this.route.data.subscribe(param => {
      this.data.next(param)
    });
  }


  /**
  *  @author @l.piciollo 
   * @param pageUrl      Url della pagina di destinazione
   * @param extras       Oggetto contenente direttire di rotta
   * @param queryParams  parametri da passare alla pagina
   * @description funzione che si occupa di richiamare una pagina e di passare parametri per query url.
   * è possibile passare anche json complessi, il tutto viene annidato in un unico oggetto e convertito in base64
   * per essere trasportato.
   */
  goToPage(pageUrl: string, extras = {}, queryParams = {}, preservedQueryParams: Array<string> = []) {
    try {
      queryParams != null ? null : queryParams = {};
      const url = window.location.href;
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      preservedQueryParams.forEach(k => {
        if (!queryParams.hasOwnProperty(k)) {
          queryParams[k] = httpParams.get(k)
        }
      })
      if (extras == undefined || extras == null) extras = {};
      if (queryParams != null) {
        Object.assign(extras, { queryParams: queryParams })
      }
      this.router.navigate([pageUrl], extras).then(redirected => { });
    } catch (e) {
      throw e;
    }
  }



  ngOnInit(): void { }
  ngAfterContentInit(): void { }
  ngOnDestroy(): void { }
  ngAfterViewInit(): void { }
  ngAfterViewChecked(): void { }
  ngAfterContentChecked(): void { }
  ngDoCheck(): void { }
  ngOnChanges(changes: SimpleChanges): void { }
}