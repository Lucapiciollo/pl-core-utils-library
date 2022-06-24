/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-24 14:47:50
 * @modify date 2020-11-24 14:47:50
 * @desc [description]
 */
import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { PlCoreUtils } from '../../pl-core-utils-library.service';
import { AlertComponent } from './alert.component';



@Injectable({
  providedIn: "root"
})
/**
 * Classe di servizio per il componente Alert. al momento dell'import del servizio.. questo si occupa di sovrascrivere
 * le funzionalita di alert della classe window. Alla chiamata di alert(), quindi, verrà visualizzata una schermata di alert
 * con grafica bootstrap.
 */
export class AlertService {

  /***************************************************************************************************************************** */
  private oldAlert = window.alert;
  private componentRef = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    (<any>window.alert) = function (title: string, message: string) {
      if (arguments.length > 1) {
        PlCoreUtils.Broadcast().execEvent("CORE:INFO_SERVICE_DIALOG", { title: title, body: message });
      } else {
        PlCoreUtils.Broadcast().execEvent("CORE:INFO_SERVICE_DIALOG", { title: null, body: title });
      }
      return
    }
  }

  /**
   * funzionalità per disabilitare il componente e ripristinare alert() nativo messo a disposizione da window.
   */
  public enableAlertMessage(enable: boolean) {
    if (enable) {
      this.componentRef = this.componentFactoryResolver.resolveComponentFactory(AlertComponent).create(this.injector);
      this.appRef.attachView(this.componentRef.hostView);
      const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    } else {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      (<any>window.alert) = this.oldAlert;
    }
  }


}
