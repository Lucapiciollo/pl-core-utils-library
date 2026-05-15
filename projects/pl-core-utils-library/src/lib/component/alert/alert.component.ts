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

  /** Registra il listener broadcast e inizializza la coda con push intercettato. */
  ngOnInit(): void {
    this.push();

    PlCoreUtils.Broadcast().listenEvent<AlertBroadcastPayload>(
      'CORE:INFO_SERVICE_DIALOG',
      this.infoServiceDialogListener
    );
  }

  /** Rimuove il listener broadcast alla distruzione del componente. */
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

  /** Apre il prossimo messaggio disponibile in coda. */
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

  /** Intercetta push della coda per aprire automaticamente il dialog quando libero. */
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