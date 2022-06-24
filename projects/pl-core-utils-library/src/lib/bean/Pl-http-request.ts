/**
 * @author @l.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2020-11-19 12:16:49
 * @modify date 2020-11-19 12:16:49
 * @desc [bean di utiliti per la creazione di parametri per chiamate http, è possibile passare URL con path params
 *        il bean al ritorno della url, provvederà valorizzare i path params.      
 * ]
 */

import { HttpHeaders } from "@angular/common/http";

export class PlHttpRequest {

    private _service: { url: string, mocked?: boolean, method?: string } = Object();
    private _body: any = null;
    private _queryParams: JSON = null;
    private _pathParams: JSON = null;
    private _httpHeaders: HttpHeaders = null;

    constructor(objectService: { url: string, mocked?: boolean, method?: string }, pathParams: JSON, queryParams: JSON, body: JSON|FormData|any, httpHeaders?: HttpHeaders) {
        this.queryParams = queryParams;
        this.pathParams = pathParams;
        this.body = body;
        this.service = objectService;
        this.httpHeaders = httpHeaders;
    }

    /**
     * valorizza un header aggiuntivo
     */
    public set httpHeaders(object: HttpHeaders) {
        this._httpHeaders = object
    }


    /**
     * valorizzazione del body da passare a chiamate di tipo POST ad esempio
     */
    public set body(object: any) {
        if (!(object instanceof FormData)) {
            this._body = JSON.parse(JSON.stringify(object))
        }else{
            this._body =  object 
        }
    }

    /**
     * ogetto raffigurante i parametri base del servizio
     */
    public set service(object: { url: string, mocked?: boolean, method?: string }) {
        this._service = JSON.parse(JSON.stringify(object))
    }

    /**
     * oggetto contenete i parametri da passare in query string per chiamate GET ad esempio
     */
    public set queryParams(object: JSON) {
        this._queryParams = JSON.parse(JSON.stringify(object))
    }

    /**
     * oggetto contenente i path params per valorizzare la url
     */
    public set pathParams(object: JSON) {
        this._pathParams = JSON.parse(JSON.stringify(object))
    }

    /**
     * viene valorizzata la url da richiamare
     */
    public set url(url: string) {
        this._service.url = url;
    }


    /**
     * ritorna l'header passato
     */
    public get httpHeaders() {
        return this._httpHeaders;
    }
    /**
     * ritorna il body da passare a servizi come POST
     */
    public get body() {
        return this._body
    }

    /**
     * ritorna l'oggetto contenente i query params da passare al servizio
     */
    public get queryParams() {
        return this._queryParams;
    }

    /**
     * ritorna il metodo invocato
     */
    public get method() {
        return this._service.method
    }

    /**
     * indica se il servizio è un mock oppure no
     */
    public get mocked() {
        return this._service.mocked
    }
    /**
     * ritorna la url, valorizzata con in path params passati, in caso non siano presenti
     * viene passassata la url senza essere riadattata.
     */
    public get url() {
        if (this._pathParams != null) {
            return this._service.url.split("/").map(par => {
                if (par.startsWith(":")) {
                    return this._pathParams[par.replace(":", "")]
                } else return par
            }).join("/");
        } else return this._service.url
    }
}
