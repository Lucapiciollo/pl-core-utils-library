/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-21 12:30:36
 * @modify date 2019-12-21 12:30:36
 * @desc [ modulo comune a tutto l'applicativo, si occupa di condividere altri moduli e funzionalita con il sistema. 
 * tutti i componenti o moduli che dovranno essere condivisi con il resto dell'applicazione devono essere posti in 
 * import ed in export
 * ]
 */
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
 import { CommonModule } from '@angular/common';
import { GlobalService } from '../../shared/service/global.service';
import { MaterialModule } from './material.module';
import { ListItemComponent } from 'src/app/list-item/list-item.component';
import { NgxOrgChartModule } from 'src/app/ngx-org-chart/ngx-org-chart.module';
 
 /**
 *  @author @l.piciollo
 *  modulo comune a tutto l'applicativo, si occupa di condividere altri moduli e funzionalita con il sistema. 
 *  tutti i componenti o moduli che dovranno essere condivisi con il resto dell'applicazione devono essere posti in 
 *  impport ed in export
 */
@NgModule({
  declarations: [ListItemComponent  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    NgxOrgChartModule
  ],
  providers: [GlobalService],
  exports: [
    NgxOrgChartModule,
    ListItemComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    MaterialModule
  ]
})
export class SharedModule {

  constructor(private globalService: GlobalService) { /**inizializzazione del servizio per la creazione dei listener */}
  
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [],
      import: []
    }
  }
}
