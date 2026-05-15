/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-24 12:37:01
 * @modify date 2020-11-24 12:37:01
 * @desc Componente per la mostra di messaggi alert().
 * Il componente è in grado di accodare tutte le richieste di messaggio
 * pervenute dal sistema tramite Broadcast e le mostra in modalità FIFO.
 */

import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  PlBroadcastEventListener,
  PlCoreUtils
} from '../../pl-core-utils-library.service';

interface AlertBroadcastPayload {
  title?: string | null;
  body?: string;
}

interface AlertMessageInfo {
  title: string | null;
  body: string;
  type?: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  standalone: false
})
/**
 * Componente grafico per la visualizzazione dell'alert.
 */
export class AlertComponent implements OnInit, OnDestroy {
  /**
   * Contenitore di messaggi.
   */
  public queueMessageInfo: AlertMessageInfo[] = [];

  /**
   * Messaggio corrente processato dalla coda.
   */
  public messageInfo: AlertMessageInfo | null = null;

  /**
   * Riferimento al modale html.
   */
  @ViewChild('dialog') dialog: ElementRef | undefined;

  private readonly infoServiceDialogListener: PlBroadcastEventListener<AlertBroadcastPayload> = message => {
    const detail = message.detail;

    if (!detail?.body) {
      return;
    }

    this.queueMessageInfo.push({
      title: detail.title ?? null,
      body: detail.body
    });
  };

  constructor() {}

  ngOnInit(): void {
    this.push();

    PlCoreUtils.Broadcast().listenEvent<AlertBroadcastPayload>(
      'CORE:INFO_SERVICE_DIALOG',
      this.infoServiceDialogListener
    );
  }

  ngOnDestroy(): void {
    PlCoreUtils.Broadcast().removeListenEvent<AlertBroadcastPayload>(
      'CORE:INFO_SERVICE_DIALOG',
      this.infoServiceDialogListener
    );
  }

  /**
   * Funzionalità per la chiusura della modale.
   */
  closeDialog(): void {
    this.messageInfo = null;

    setTimeout(() => {
      if (this.queueMessageInfo.length > 0) {
        this.openDialog();
      }
    }, 500);
  }

  private openDialog(): void {
    const nextMessage = this.queueMessageInfo.splice(0, 1)[0];

    if (!nextMessage) {
      return;
    }

    this.messageInfo = {
      ...nextMessage,
      type: 'alert-info'
    };
  }

  private push(): void {
    const component = this;
    const originalPush = this.queueMessageInfo.push;

    this.queueMessageInfo.push = function (...items: AlertMessageInfo[]): number {
      const result = originalPush.apply(this, items);

      if (component.messageInfo == null) {
        component.openDialog();
      }

      return result;
    };
  }
}