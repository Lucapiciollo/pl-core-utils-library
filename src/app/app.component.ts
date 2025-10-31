import { AfterViewInit, Component, Inject, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';


import * as uuid from 'uuid';
import { GroupDtoSearchResult } from './com/mycompany/normalize/shared/model/groupDtoSearchResult';
import { GroupDto } from './com/mycompany/normalize/shared/model/groupDto';
import * as $ from "jquery.orgchart.js"
import { PlUtilsService } from 'projects/pl-core-utils-library/src/lib/service/pl-utils.service';
import { PlHttpService } from 'projects/pl-core-utils-library/src/lib/service/pl-http.service';

export class GroupDtoResult implements GroupDtoSearchResult {
  items?: any[] = [];

}


export class Item {
  name: string;
  uId: string;
  childs: Item[];

  constructor(options: {
    name: string,
    childs?: Item[]
  }) {
    this.name = options.name;
    this.uId = uuid.v4();
    this.childs = options.childs || [];
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})


export class AppComponent implements AfterViewInit {


  public uuid = uuid.v4();



  static injector: Injector;

  title = "";

  constructor(protected ambientModeLoaderService: PlUtilsService, public plHttpService: PlHttpService) {


  }
  ngAfterViewInit(): void {
    JSON.findByKeyAndValue(this.groupDtoResult.items, "name", "Dev").forEach((item) => {
      console.log(item)
    })
  }





  public async method() {

  }



  public ngOnInit() {


    this.groupDtoResult = {

      "items": [
        {
          "id": "dc098140-fed0-404c-9c26-0dad92e9daed",
          "name": "Amministrazione",
          "items": [
                {
                  "id": "dc098140-fed0-404c-9c26-0dad92e9daed",
                  "name": "Amministrazione",
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
              ],
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
              ],
          "type": 0,
          "users": [],
          "sons": [
            {
              "id": "907ad427-37db-4e07-bf08-8ed6b8413d4b",
              "name": "HR",
              "type": 0,
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
                      "isHierarchical": true,
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
                  ]
                }
              ]
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
              "isHierarchical": true,
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
          ]
        }
      ]
    }





  }



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



  public nodes: any = [{
    "childs": [
      {
        "childs": [
          {
            "childs": [],
            "name": "figlio di BE",
            "id": "dfe83eb8-172a-4334-a5d1-105b25b5ff10"
          }
        ],
        "name": "Back End",
        "id": "2d8cc7b0-0f17-4af8-9eb9-d089f165b8f1"
      },
      {
        "childs": [
          {
            "childs": [],
            "name": "test",
            "id": "4545e4ba-05a3-40dc-addd-b31354054956"
          }
        ],
        "name": "Front End",
        "id": "5bf00d4a-fa26-40cf-83ed-01a3bb5b2574"
      }
    ]
  }];




}
