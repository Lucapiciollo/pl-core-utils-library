/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-12-22 16:42:38
 * @modify date 2020-12-22 16:42:38
 * @desc Componente base per l'estensione di componenti.
 * Utile per la condivisione di servizi e funzionalità basilari comuni a tutti i componenti.
 */

import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { Log } from 'pl-decorator';

import { PlGraphicService } from '../../service/pl-graphic.service';
import { PlHttpService } from '../../service/pl-http.service';
import { PlNetworkService } from '../../service/pl-network.service';
import { PlUtilsService } from '../../service/pl-utils.service';
import { PLWorkerService } from '../../service/pl-worker.service';

@Component({
  template: '',
  standalone: false
})
export class PlBaseComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  protected graphicService: PlGraphicService;
  protected httpService: PlHttpService;
  protected networkService: PlNetworkService;
  protected utilsService: PlUtilsService;
  protected workerService: PLWorkerService;

  protected queryParams: ReplaySubject<Record<string, any>> =
    new ReplaySubject<Record<string, any>>(1);

  protected params: ReplaySubject<Record<string, any>> =
    new ReplaySubject<Record<string, any>>(1);

  protected data: ReplaySubject<Record<string, any>> =
    new ReplaySubject<Record<string, any>>(1);

  protected queryParamsObs: Subscription | null = null;
  protected paramsObs: Subscription | null = null;
  protected dataObs: Subscription | null = null;

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
      this.params.next(param);
    });

    this.queryParamsObs = this.route.queryParams.subscribe(param => {
      this.queryParams.next(param);
    });

    this.dataObs = this.route.data.subscribe(param => {
      this.data.next(param);
    });
  }

  /**
   * Funzione che si occupa di navigare verso una pagina
   * e di passare eventuali query params.
   *
   * È possibile preservare alcuni query params già presenti nella rotta corrente.
   */
  goToPage(
    pageUrl: string,
    extras: Record<string, any> = {},
    queryParams: Record<string, any> = {},
    preservedQueryParams: string[] = []
  ): void {
    const safeQueryParams = queryParams ?? {};
    const safeExtras = extras ?? {};
    const currentQueryParams = this.route.snapshot.queryParams ?? {};

    preservedQueryParams.forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(safeQueryParams, key)) {
        safeQueryParams[key] = currentQueryParams[key] ?? null;
      }
    });

    this.router.navigate([pageUrl], {
      ...safeExtras,
      queryParams: safeQueryParams
    });
  }

  @Log('debug')
  ngOnInit(): void {}

  @Log('debug')
  ngAfterContentInit(): void {}

  @Log('debug')
  ngOnDestroy(): void {
    this.queryParamsObs?.unsubscribe();
    this.paramsObs?.unsubscribe();
    this.dataObs?.unsubscribe();

    this.queryParamsObs = null;
    this.paramsObs = null;
    this.dataObs = null;

    this.queryParams.complete();
    this.params.complete();
    this.data.complete();
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {}

  ngAfterContentChecked(): void {}

  ngDoCheck(): void {}

  ngOnChanges(changes: SimpleChanges): void {}
}