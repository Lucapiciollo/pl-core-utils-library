import { Component, EventEmitter, Inject, Injector, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PlHttpService, PlUtilsService } from 'pl-core-utils-library';
import { of } from 'rxjs/internal/observable/of';
import { connectable, timer, Subject, interval, takeUntil, from, Observable, zip, fromEvent, merge, race, combineLatest, EMPTY, forkJoin, concat } from 'rxjs';

import { audit, auditTime, buffer, bufferCount, bufferTime, bufferToggle, bufferWhen, delay, distinctUntilKeyChanged, elementAt, flatMap, map, mergeAll, mergeMap, pluck, publish, take, tap } from 'rxjs/operators';
import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragMove, CdkDragRelease, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';

import * as uuid from 'uuid';

export class Item {
    name: string;
    uId: string;
    children: Item[];

    constructor(options: {
        name: string,
        children?: Item[]
    }) {
        this.name = options.name;
        this.uId = uuid.v4();
        this.children = options.children || [];
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {



  public app = JSON.parse(`{
    "wrapper": "div#div_id.div_class[attribute-one=value]",
    "sections": {
      "main": {
        "type": "product"
      }
    },
    "order": [
      "main"
    ]
  }`).PROXY()

  static injector: Injector;

  title = "";

  constructor(@Inject(DOCUMENT) private document: Document,private injector: Injector, protected ambientModeLoaderService: PlUtilsService, private modalService: NgbModal, public plHttpService: PlHttpService) {
    this.injector = injector;
 
    this.parentItem = new Item({ name: 'parent-item' });
  }





  public async method() {

  }
 
  public parentItem: Item;
  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getIdsRecursive(this.parentItem).reverse();
  }

 

  public ngOnInit() {
    this.parentItem.children.push(new Item({
      name: 'test1',
      children: [
        new Item({ name: 'subItem1' }),
        new Item({ name: 'subItem2' }),
        new Item({ name: 'subItem3' })
      ]
    }));
    this.parentItem.children.push(new Item({
      name: 'test2',
      children: [
        new Item({ name: 'subItem4' }),
        new Item({ name: 'subItem5' }),
        new Item({
          name: 'subItem6', children: [
            new Item({ name: 'subItem8' })
          ]
        })
      ]
    }));
    this.parentItem.children.push(new Item({ name: 'test3' }));
  }

  public onDragDrop(event: CdkDragDrop<Item>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      event.container.data.children.push(movingItem);
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.uId !== movingItem.uId);
    } else {
      moveItemInArray(
        event.container.data.children,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(   this.parentItem)
  }

  private getIdsRecursive(item: Item): string[] {
    let ids = [item.uId];
    item.children.forEach((childItem) => { ids = ids.concat(this.getIdsRecursive(childItem)) });
    return ids;
  }

  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;

    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingItem, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  private hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
    return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  }

}
 