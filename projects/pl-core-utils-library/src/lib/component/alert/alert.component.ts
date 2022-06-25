/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-24 12:37:01
 * @modify date 2020-11-24 12:37:01
 * @desc [Componente per la mostra di messaggi alert(), il componente è in grado di accodare tutte le richieste di messaggio
 * pervenute dal sistema, tramite il comando alert(), e le mostra in modalita FIFO]
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlCoreUtils } from '../../pl-core-utils-library.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
/**
 * Componente grafico per la visualizzazione dell'alert
 */
export class AlertComponent implements OnInit {
  /**
   * contenitore di messaggi
   */
  public queueMessageInfo = [];
  /**
   * messaggio corrente processato dalla coda
   */
  public messageInfo = null;
  /**
   * riferimento al modale html 
   */
  @ViewChild('dialog') dialog: ElementRef<any>;


  constructor() { }


  ngOnInit() {
    this.push();
    PlCoreUtils.Broadcast().listenEvent("CORE:INFO_SERVICE_DIALOG", (message) => {
      if ('body' in message.detail)
        this.queueMessageInfo.push(message.detail)
      else {
        this.queueMessageInfo.push({ title: null, body: message.detail.body })
      }
    });
  }

  /**
   * funzionalità per la chiusura della modale
   */
  closeDialog() {
    this.messageInfo = null;
    setTimeout(() => {
      if (this.queueMessageInfo.length > 0) {
        this.openDialog();
      }
    }, 500);
  }

  private openDialog() {
    this.messageInfo = this.queueMessageInfo.splice(0, 1)[0];
    this.messageInfo["type"] = "alert-info";
  }

  private push() {
    let _this = this;
    /// @ts-ignore
    this.queueMessageInfo.push = function () {
      Array.prototype.push.apply(this, arguments as any);
      if (_this.messageInfo == null) {
        _this.openDialog();
      }

      return this;
    }
  }

}
