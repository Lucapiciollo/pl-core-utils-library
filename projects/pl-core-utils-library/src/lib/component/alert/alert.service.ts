/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-24 14:47:50
 * @modify date 2020-11-24 14:47:50
 * @desc Servizio per la gestione dell'alert custom della libreria.
 */

import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';

import { PlCoreUtils } from '../../pl-core-utils-library.service';
import { AlertComponent } from './alert.component';

interface AlertBroadcastPayload {
  title: string | null;
  body: string;
}

/**
 * Classe di servizio per il componente Alert.
 * Al momento dell'abilitazione sovrascrive window.alert().
 * Alla chiamata di alert(), viene visualizzato un alert custom tramite AlertComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly oldAlert: typeof window.alert =
    typeof window !== 'undefined'
      ? window.alert.bind(window)
      : (() => undefined);

  private componentRef: ComponentRef<AlertComponent> | null = null;
  private alertEnabled = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.overrideWindowAlert();
  }

  /**
   * Funzionalità per abilitare/disabilitare il componente
   * e ripristinare alert() nativo messo a disposizione da window.
   */
  public enableAlertMessage(enable: boolean): void {
    if (enable) {
      this.createAlertComponent();
      this.alertEnabled = true;
      return;
    }

    this.destroyAlertComponent();
    this.restoreWindowAlert();
    this.alertEnabled = false;
  }

  private overrideWindowAlert(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.alert = ((...args: any[]): void => {
      const payload: AlertBroadcastPayload =
        args.length > 1
          ? {
              title: String(args[0] ?? ''),
              body: String(args[1] ?? '')
            }
          : {
              title: null,
              body: String(args[0] ?? '')
            };

      PlCoreUtils.Broadcast().execEvent<AlertBroadcastPayload>(
        'CORE:INFO_SERVICE_DIALOG',
        payload
      );
    }) as typeof window.alert;
  }

  private restoreWindowAlert(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.alert = this.oldAlert;
  }

  private createAlertComponent(): void {
    if (this.componentRef || typeof document === 'undefined') {
      return;
    }

    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(AlertComponent)
      .create(this.injector);

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<unknown>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);
  }

  private destroyAlertComponent(): void {
    if (!this.componentRef) {
      return;
    }

    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;
  }
}