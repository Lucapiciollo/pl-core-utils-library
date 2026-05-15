/**
 * Genera un UUID v4.
 *
 * Usa crypto.randomUUID() quando disponibile.
 * In fallback usa una generazione compatibile browser.
 */
export function createPlUuid(): string {
  const cryptoRef = getCrypto();

  if (cryptoRef?.randomUUID) {
    return cryptoRef.randomUUID();
  }

  return createFallbackUuid();
}

function getCrypto(): Crypto | null {
  if (typeof crypto !== 'undefined') {
    return crypto;
  }

  if (typeof globalThis !== 'undefined' && 'crypto' in globalThis) {
    return globalThis.crypto as Crypto;
  }

  return null;
}

function createFallbackUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}