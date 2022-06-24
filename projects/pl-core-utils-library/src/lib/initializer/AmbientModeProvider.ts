import { PlAmbientModeLoaderService   } from '../service/pl-ambient-mode.service';
import "../extension/custom-extension-rxjs";
/**
* @author l.piciollo
* intercettazione avvio applicazione, per il settaggio dell'ambiente, per determinare il tipo di browser..  
* l'applicazione non avrà inizio fin quando la funziona non termina con un OK 
*/
export default function AmbientModeProviderFactory(ambientModeService : PlAmbientModeLoaderService  ) {
    let sub;
    return (): Promise<any> => { 
        return new Promise((resolve, reject) => {
            /**
             *  caricamento dei dati per determinare l'ambiente, in caso di errore questo viene tramandato al gestore di errori 
             */
            const ambient = ambientModeService.detect( ).subscribe(success => {
                resolve(success)
            }, err => {
                reject(err);
            }) ;
        })
    };

}