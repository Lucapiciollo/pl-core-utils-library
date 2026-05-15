import { PlAmbientModeLoaderService } from '../service/pl-ambient-mode.service';
import "../extension/custom-extension-rxjs";
/** Inizializzatore applicativo: rileva ambiente/browser prima del bootstrap applicazione. */
export default function AmbientModeProviderFactory(ambientModeService: PlAmbientModeLoaderService) {
    return (): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const ambient = ambientModeService.detect();
                resolve(ambient);
            } catch (err) {
                reject(err);
            }
        })
    };

}