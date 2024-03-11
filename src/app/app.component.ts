import { AfterViewInit, Component, Inject, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PlHttpService, PlUtilsService } from 'pl-core-utils-library';

import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';


import * as uuid from 'uuid';
import { GroupDtoSearchResult } from './com/mycompany/normalize/shared/model/groupDtoSearchResult';
import { GroupDto } from './com/mycompany/normalize/shared/model/groupDto';
import * as $ from "jquery.orgchart.js"

export class GroupDtoResult implements GroupDtoSearchResult {
  items?: GroupDto[] = [];

}


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


export class AppComponent implements AfterViewInit{


  public uuid = uuid.v4();



  static injector: Injector;

  title = "";

  constructor(protected ambientModeLoaderService: PlUtilsService, public plHttpService: PlHttpService) {


    // this.parentItem = new Item({ name: 'parent-item' });
  }
  ngAfterViewInit(): void {
 
  }





  public async method() {

  }

  // public parentItem: Item;
  // public get connectedDropListsIds(): string[] {
  //   // We reverse ids here to respect items nesting hierarchy
  //   return this.getIdsRecursive(this.parentItem).reverse().concat([this.uuid]);
  // }
 

  public ngOnInit() {


    // this.parentItem.children.push(new Item({
    //   name: 'test1',
    //   children: [
    //     new Item({ name: 'subItem1' }),
    //     new Item({ name: 'subItem2' }),
    //     new Item({ name: 'subItem3' })
    //   ]
    // }));
    // this.parentItem.children.push(new Item({
    //   name: 'test2',
    //   children: [
    //     new Item({ name: 'subItem4' }),
    //     new Item({ name: 'subItem5' }),
    //     new Item({
    //       name: 'subItem6', children: [
    //         new Item({ name: 'subItem8' })
    //       ]
    //     })
    //   ]
    // }));
    // this.parentItem.children.push(new Item({ name: 'test3' }));


    // Array.from({ length: 10 }, (_, id) => {
    //   this.groupDtoResult.items.push({ id: uuid.v4(), name: String(id),approvers:[],fathers:[],sons:[] })
    // });
    this.groupDtoResult = {
      
      "items": [
        {
          "id": "dc098140-fed0-404c-9c26-0dad92e9daed",
          "name": "Amministrazione",
          "type": 0,
          "users": [],
          "sons": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0
            }
          ],
          "fathers": [],
          "approvers": []
        },
        {
          "id": "07faea71-c929-44d2-a740-13a605f42f8e",
          "name": "Figlio di backend",
          "type": 0,
          "users": [],
          "sons": [],
          "fathers": [
            {
              "id": "25b8a1ce-af4a-4485-bf44-6837ce9081a7",
              "name": "Back End",
              "type": 0
            }
          ],
          "approvers": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0,
              "isHierarchical": false
            }
          ]
        },
        {
          "id": "25b8a1ce-af4a-4485-bf44-6837ce9081a7",
          "name": "Back End",
          "type": 0,
          "users": [],
          "sons": [
            {
              "id": "07faea71-c929-44d2-a740-13a605f42f8e",
              "name": "Figlio di backend",
              "type": 0
            }
          ],
          "fathers": [
            {
              "id": "aee1452e-2fa3-4c0e-9a04-ecb608d9d30b",
              "name": "Dev",
              "type": 0
            }
          ],
          "approvers": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0,
              "isHierarchical": false
            }
          ]
        },
        {
          "id": "7e02aa97-5e49-40d7-9f36-7c1c74702f50",
          "name": "Front End",
          "type": 0,
          "users": [],
          "sons": [],
          "fathers": [
            {
              "id": "aee1452e-2fa3-4c0e-9a04-ecb608d9d30b",
              "name": "Dev",
              "type": 0
            }
          ],
          "approvers": []
        },
        {
          "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
          "name": "HR",
          "type": 0,
          "users": [],
          "sons": [
            {
              "id": "aee1452e-2fa3-4c0e-9a04-ecb608d9d30b",
              "name": "Dev",
              "type": 0
            }
          ],
          "fathers": [
            {
              "id": "dc098140-fed0-404c-9c26-0dad92e9daed",
              "name": "Amministrazione",
              "type": 0
            }
          ],
          "approvers": []
        },
        {
          "id": "aee1452e-2fa3-4c0e-9a04-ecb608d9d30b",
          "name": "Dev",
          "type": 0,
          "users": [],
          "sons": [
            {
              "id": "25b8a1ce-af4a-4485-bf44-6837ce9081a7",
              "name": "Back End",
              "type": 0
            },
            {
              "id": "7e02aa97-5e49-40d7-9f36-7c1c74702f50",
              "name": "Front End",
              "type": 0
            }
          ],
          "fathers": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0
            }
          ],
          "approvers": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0,
              "isHierarchical": true
            }
          ]
        }
      ]
    }




    
  }

  // public onDragDrop(event: CdkDragDrop<Item>) {
  //   event.container.element.nativeElement.classList.remove('active');
  //   if (this.canBeDropped(event)) {
  //     const movingItem: Item = event.item.data;
  //     event.container.data.children.push(movingItem);
  //     event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.uId !== movingItem.uId);
  //   } else {
  //     moveItemInArray(
  //       event.container.data.children,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  //   console.log(this.parentItem)
  // }

  // private getIdsRecursive(item: Item): string[] {
  //   let ids = [item.uId];
  //   item.children.forEach((childItem) => { ids = ids.concat(this.getIdsRecursive(childItem)) });
  //   return ids;
  // }

  // private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
  //   const movingItem: Item = event.item.data;

  //   return event.previousContainer.id !== event.container.id
  //     && this.isNotSelfDrop(event)
  //     && !this.hasChild(movingItem, event.container.data);
  // }

  // private isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
  //   return event.container.data.uId !== event.item.data.uId;
  // }

  // private hasChild(parentItem: Item, childItem: Item): boolean {
  //   const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
  //   return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  // }






  public groupDtoResult = new GroupDtoResult();



  public uniqueGroup;



  todo: GroupDto;


  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log(this.todo)
  }



  public   nodes: any = [
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: '',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health', 
              childs: [
                {
                  name: 'Beau Avril',
                  cssClass: 'ngx-org-head',
                  image: 'assets/node.svg',
                  title: 'Global Head of Business Operations',
                  childs: []
                },
                {
                  name: 'Tara Walpert Levy',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/node.svg',
                  title: 'VP, Agency and Brand Solutions',
                  childs: [
                    {
                      name: 'Beau Avril',
                      cssClass: 'ngx-org-head',
                      image: 'assets/node.svg',
                      title: 'Global Head of Business Operations',
                      childs: []
                    },
                    {
                      name: 'Tara Walpert Levy',
                      cssClass: 'ngx-org-vp',
                      image: 'assets/node.svg',
                      title: 'VP, Agency and Brand Solutions',
                      childs: [
                        {
                          name: 'Beau Avril',
                          cssClass: 'ngx-org-head',
                          image: 'assets/node.svg',
                          title: 'Global Head of Business Operations',
                          childs: []
                        },
                        {
                          name: 'Tara Walpert Levy',
                          cssClass: 'ngx-org-vp',
                          image: 'assets/node.svg',
                          title: 'VP, Agency and Brand Solutions',
                          childs: [
                            {
                              name: 'Beau Avril',
                              cssClass: 'ngx-org-head',
                              image: 'assets/node.svg',
                              title: 'Global Head of Business Operations',
                              childs: []
                            },
                            {
                              name: 'Tara Walpert Levy',
                              cssClass: 'ngx-org-vp',
                              image: 'assets/node.svg',
                              title: 'VP, Agency and Brand Solutions',
                              childs: []
                            },
                            {
                              name: 'Ariel Bardin',
                              cssClass: 'ngx-org-vp',
                              image: 'assets/node.svg',
                              title: 'VP, Product Management',
                              childs: []
                            }
                          ]
                        },
                        {
                          name: 'Ariel Bardin',
                          cssClass: 'ngx-org-vp',
                          image: 'assets/node.svg',
                          title: 'VP, Product Management',
                          childs: []
                        }
                      ]
                    },
                    {
                      name: 'Ariel Bardin',
                      cssClass: 'ngx-org-vp',
                      image: 'assets/node.svg',
                      title: 'VP, Product Management',
                      childs: []
                    }
                  ]
                },
                {
                  name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/node.svg',
                  title: 'VP, Product Management',
                  childs: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: 'assets/node.svg',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    },
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: 'assets/node.svg',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    }
  ];

 



}
