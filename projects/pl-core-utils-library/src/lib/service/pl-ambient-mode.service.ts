import {
  Inject,
  Injectable,
  InjectionToken,
  Optional
} from '@angular/core';

export enum BROWSER {
  EDGE = 'edge',
  OPERA = 'opera',
  CHROME = 'chrome',
  IE = 'ie',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  OTHER = 'other',
  ALL = 'all'
}

/**
 * Token per identificare quali browser sono supportati.
 *
 * Esempio:
 *
 * ```ts
 * { provide: BROWSER_VALID, useValue: [BROWSER.ALL] }
 * ```
 */
export const BROWSER_VALID = new InjectionToken<BROWSER[]>('BROWSER_VALID');

/**
 * Token per identificare se disabilitare o meno i log console.
 *
 * Esempio:
 *
 * ```ts
 * { provide: DISABLE_LOG, useValue: true }
 * ```
 */
export const DISABLE_LOG = new InjectionToken<boolean>('DISABLE_LOG');

export interface PlAmbientModeResult {
  browser: BROWSER;
  supported: boolean;
  disableLog: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlAmbientModeLoaderService {
  private readonly originalConsoleLog: typeof console.log =
    typeof console !== 'undefined'
      ? console.log.bind(console)
      : (() => undefined);

  private lastResult: PlAmbientModeResult | null = null;

  constructor(
    @Optional() @Inject(BROWSER_VALID) private readonly browserValid: BROWSER[] | null,
    @Optional() @Inject(DISABLE_LOG) private readonly disableLogValue: boolean | null
  ) {}

  /**
   * Rileva browser, applica eventuale disabilitazione log
   * e restituisce l'esito della validazione ambiente.
    * @returns Risultato rilevazione ambiente/browser.
   */
  detect(): PlAmbientModeResult {
    const browser = this.getBrowser();
    const disableLog = this.disableLogValue ?? false;
    const supported = this.isBrowserSupported(browser);

    if (disableLog) {
      this.disableLog();
    } else {
      this.enableLog();
    }

    this.lastResult = {
      browser,
      supported,
      disableLog
    };

    if (!supported) {
      this.renderUnsupportedBrowserPage(browser);
    }

    return this.lastResult;
  }

  /**
   * Restituisce l'ultimo risultato calcolato da detect().
    * @returns Ultimo risultato ambient mode oppure `null`.
   */
  getLastResult(): PlAmbientModeResult | null {
    return this.lastResult;
  }

  /**
   * Restituisce il browser corrente.
    * @returns Browser rilevato.
   */
  getBrowser(): BROWSER {
    if (typeof navigator === 'undefined') {
      return BROWSER.OTHER;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('edg/')) {
      return BROWSER.EDGE;
    }

    if (userAgent.includes('opr/') || userAgent.includes('opera')) {
      return BROWSER.OPERA;
    }

    if (userAgent.includes('chrome') && !userAgent.includes('edg/')) {
      return BROWSER.CHROME;
    }

    if (userAgent.includes('firefox')) {
      return BROWSER.FIREFOX;
    }

    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return BROWSER.SAFARI;
    }

    if (userAgent.includes('msie') || userAgent.includes('trident')) {
      return BROWSER.IE;
    }

    return BROWSER.OTHER;
  }

  /**
   * Verifica se il browser è supportato in base al token BROWSER_VALID.
    * @param browser Browser da verificare. Se omesso usa quello corrente.
    * @returns `true` se browser supportato.
   */
  isBrowserSupported(browser: BROWSER = this.getBrowser()): boolean {
    const validBrowsers = this.browserValid?.length
      ? this.browserValid
      : [BROWSER.ALL];

    return validBrowsers.includes(BROWSER.ALL) || validBrowsers.includes(browser);
  }

  /**
   * Disabilita console.log.
   */
  disableLog(): void {
    if (typeof console === 'undefined') {
      return;
    }

    console.log = () => undefined;
  }

  /**
   * Riabilita console.log originale.
   */
  enableLog(): void {
    if (typeof console === 'undefined') {
      return;
    }

    console.log = this.originalConsoleLog;
  }

  /**
   * Mostra una pagina HTML basilare quando il browser non è supportato.
   */
  private renderUnsupportedBrowserPage(browser: BROWSER): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.innerHTML = this.createUnsupportedBrowserTemplate(browser);
  }

  private createUnsupportedBrowserTemplate(browser: BROWSER): string {
    return `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        background: #f5f7fb;
        color: #222;
        text-align: center;
        padding: 32px;
      ">
        <div style="
          max-width: 560px;
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        ">
          <h1 style="margin: 0 0 16px;">Ooooops !!!</h1>
          <h3 style="margin: 0 0 12px;">
            Il tuo browser ${browser} sembra non essere al momento compatibile
          </h3>
          <p style="margin: 0;">
            Si raccomanda di utilizzare un altro browser.
          </p>
        </div>
      </div>
    `;
  }
}