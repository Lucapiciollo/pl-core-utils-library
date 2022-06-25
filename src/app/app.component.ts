import { Component, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PlHttpService, PlUtilsService } from 'pl-core-utils-library';




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
 
    alert("CIao", "CIao") 
  }







}

