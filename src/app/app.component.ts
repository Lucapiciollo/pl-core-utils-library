import { Component, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PlHttpService, PlUtilsService } from 'pl-core-utils-library';
import { of } from 'rxjs/internal/observable/of';
import { connectable, timer, Subject, interval, takeUntil, from, Observable, zip, fromEvent, merge, race, combineLatest, EMPTY, forkJoin, concat } from 'rxjs';
import { bindCallback } from 'rxjs';

import { audit, auditTime, buffer, bufferCount, bufferTime, bufferToggle, bufferWhen, delay, distinctUntilKeyChanged, elementAt, flatMap, map, mergeAll, mergeMap, pluck, publish, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {


  static injector: Injector;

  title = "";

  constructor(private injector: Injector, protected ambientModeLoaderService: PlUtilsService, private modalService: NgbModal, public plHttpService: PlHttpService) {
    this.injector = injector;
  }





  public async method() {

  }

  ngOnInit(a) {

 

      const clicks = from([{target:1,tagName:"test1"},{target:2,tagName:"test2"},{target:3,tagName:"test3"}])
      const tagNames = clicks.pipe(
          pluck('target', 'tagName')
      );
     
     tagNames.subscribe(
       x => console.log(x)
     );
 
    /*     alert("CIao", "CIao") */
  }







}

