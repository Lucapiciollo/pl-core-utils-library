import { Component, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { interval, Observable } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';
import { PlUtilsService, PlHttpService } from "../../projects/pl-core-utils-library/src/public_api"

import { FormatDate, Inject, Singleton } from "pl-decorator";
import { MyHttpClient } from './Test2';


interface Array<T> {
  removeElement: (from: number) => void;

}


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




  @Inject(MyHttpClient)
  private test3;



  public async method() {
    console.log(this.test3);
  }

  ngOnInit(a) {
    this.method();

    /*   let array = [{ file: { k: 1 }, index: 1 }, { file: { k: 2 }, index: 2 }, { file: { k: 3 }, index: 3 }]
  
      let origin = Array.prototype;
  
      (<any>Array.prototype).deleteFileAtIndex = function (position): void {
        if (position > -1 && position < this.length + 1) {
          this.splice(position, 1)
          return this.map((ele,index) => {
            ele.index -= index;
          })
        };
      };
  
  
  
  
      console.dir(array);
  
      (<any>array).deleteFileAtIndex(1);
  
      console.dir(array); */


  }







}

