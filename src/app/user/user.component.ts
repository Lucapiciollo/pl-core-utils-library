import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDrag, CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as uuid from 'uuid';
import { GroupDto } from '../com/mycompany/normalize/shared/model/groupDto';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    standalone: false
})
export class UserComponent {

  public _user;
  @Input() set user(user: GroupDto) {
    this._user = user;
  };



  constructor() {

  }



  drop(event: CdkDragDrop<GroupDto[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.filter(f => f.id == event.previousContainer.data[event.previousIndex].id).length == 0 && this._user.uId != event.previousContainer.data[event.previousIndex].id)

        if (["fathersToAdd", "sonsToAdd"].indexOf(event.container.id) > -1 && ["fathersToAdd", "sonsToAdd"].indexOf(event.previousContainer.id) > -1)
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        else
          copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    console.log(event)
    console.log(this._user)
  }



}
