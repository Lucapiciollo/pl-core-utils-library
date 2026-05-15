import { HttpHeaders } from '@angular/common/http';

export type PlHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface PlHttpRequestConfig {
    url?: string;
    method?: PlHttpMethod | string;
    body?: any;
    queryParams?: Record<string, any> | null;
    httpHeaders?: HttpHeaders | Record<string, any> | null;
    mocked?: boolean;
}

/**
 * Modello richiesta HTTP usato da PlHttpService.
 */
export class PlHttpRequest {
    url: string;
    method: PlHttpMethod;
    body?: any;
    queryParams?: Record<string, any> | null;
    httpHeaders?: HttpHeaders | Record<string, any> | null;
    mocked?: boolean;

    constructor(data: PlHttpRequestConfig = {}) {
        this.url = data.url ?? '';
        this.method = this.normalizeMethod(data.method);
        this.body = data.body;
        this.queryParams = data.queryParams ?? null;
        this.httpHeaders = data.httpHeaders ?? null;
        this.mocked = data.mocked ?? false;
    }

    private normalizeMethod(method?: PlHttpMethod | string): PlHttpMethod {
        const normalizedMethod = String(method ?? 'GET').trim().toUpperCase();

        if (this.isValidMethod(normalizedMethod)) {
            return normalizedMethod;
        }

        return 'GET';
    }

    private isValidMethod(method: string): method is PlHttpMethod {
        return ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    }
}