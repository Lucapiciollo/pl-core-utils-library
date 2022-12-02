
  

# Welcome to pl-core-utils-library!

  

Libreria core di supporto per nuove e vecchie applicazioni, si occupa di esporre allo sviluppatore, diversi servizi gia pronti e collaudati che si occupano di gestire tutto il flusso di controllo sulla navigazione di pagine, servizi di rete e tanto altro come intercettare il browser utilizzato e di specializzare altre funzionalità eventualmente mancanti per il tipo di browser. All'interno del pacchetto è presente la documentazione che illustra le varie funzionalità del pacchetto.

  
  

## Feature

  

1. Servizi di rete per chiamte ajax, tutti i metodi esposti possono essere dismessi, in modo da non lasciare appese le chiamate ajax come ad esempio il cambio di rotta applicativo, o altro.

2. servizio di cache di rete, viene gestita in autonomia la storicizzazione della cache per le chiamate configurate. è possibilità tramite questo servizio risalire alla cache evitando ulteriori chiamate al BE

3. componente per la mostra delle progressioni o avanzamenti in atto, richiamando la sua apertura è possibile risalire a tutti i processi background al mmomento attivi e killare la loro esecuzione uono ad uno

4. Servizio di intercettazione del browser, è in grado di innescare il processo di autenticazione del sistema ospitante e installare funzionalita aggiuntive in base al sistema. Ad esempio stando su IE viene adattato il meccanismo di download dei file,in quanto il comportamento è diverso da browser in browser

5. Supporto per il blocco browser dichiarati non compatibili, il blocco viene automaticamente al momento dello startup applicativo

6. Aggiunto supporto per virtualizzazione di processo complesso. Possibilita di virtualizzare i processi pesanti in modo che non impattano le performance applicative

7. Aggiunte funzionalita grafiche, come screenshot della pagina

8. Aggiunto sistema di intercettazione realtime per il controllo della dimensione della pagina, per identificare le sue dimensioni

9. Inserimento automatido di nuove funzionalità per le stringhe, array e json

10. Servizio per reperire informazioni dall'header della pagina correntemente visualizzata.

11. Classe di utilita per funzionalità come la ricerca binaria

12. Aggiunti decoratori di utilità per velocizzare processi di conversione o inibizione dei component DOM

13. Servizio di Mock, possibilità di eseguire in autonomina simulazioni di chiamata alla rete

14. Aggiunte funzionalita lato rete per la creazione di BLOB e la rimozione dello stesso.
  
15. Creazione di BaseComponent, la sua extension permette di inglobbare tutti i servizi pronti e disponibili, inoltre riceve i parametri di rotta

16. Modifcata interfaccia RxJs per l'inserimento di una funzionalita, polling, per richiamare il BE in modo iterativo in base alle configurazioni.

## Chiamate HTTP

  

Il sistema viene equipagiato con servizi utili per le chiamate al BE, tali chiamate hanno la possibilità di essere terminate in caso di determinati eventi

  

    callMock(p1: any, p2: any): Observable<any> {
        return new Observable<any>(obs => {
            let plHttpRequest: PlHttpRequest = new PlHttpRequest(
                environment.http.api.mock,
                Object({ api: "api", files: "files" }),
                Object({ api: p1, files: p2 }),
                null);
        this.httpService.GETFILE(plHttpRequest, RESPONSE_TYPE.ARRAYBUFFER, (idAjax => {
            setTimeout((id) => {
               PlCoreUtils.progressBars[id].interrupt.next(true);
            }, 10,idAjax);
        }), null).subscribe(sb => {
        obs.next(sb);
        obs.complete()
        }, error => {
            obs.error(error);
        }, () => { })
        })
    }

in questo esempio si termina il servizio dopo 10 millisecondi, ovviamente in caso di un download di file, questo termina lo scaricamento dello stesso. L'evento di termine puo essere anche avviato diversamente, tramite un pulsante ad esempio.

  

E' possibile dichiarare url contenenti dei pathParams, il sistema provvederò in autonomia alla sua valorizzazione.

  
  

    mock: {
        url: "@cachable@/example/:api/:files",
        mocked: true,
        method:"GET"
    }

passando l'oggetto sopra al plHttpRequest, questo provvederà in autonomia a sostituire i valori dei parametri, con ad esempio "api e "files"

    let plHttpRequest: PlHttpRequest = new PlHttpRequest(
        environment.http.api.mock,
        Object({ api: "api", files: "files" }),
        Object({ api: p1, files: p2 }),
        null);

  

>si avverte che le chiavi dell'oggetto contenente i valori da impostare nei pathparams, deve essere lo stesso del pathparam stesso con l'esclusione dei ":", in caso non si verificasse questo match.. la sostituzione non avverà, con la conseguente mal formattazione della URL.

  

## Esempio abilitazione cache delle chiamate di rete

il sistema come gia detto mette a disposizione anche un servizio di cache, per evitare appesantimenti di rete, per via di chiamate repentine al BE che hanno stessa request ed ovviamente stessa response. per la configurazione della cache è opportuno inserire una semplice annotazione nella url del servizio.

  

    /**
        @author l.piciollo
        si riporta un esempio di una api riconosciuta come storable, grazie al tag @cachable@ presente nella URL.
        si nota come i parametri sono passati con {0} e {1}.. il sistema è equipagiato da una funzionalita che specializza
        le stringhe ad avere il format function.. quindi .. è possibile formattare la url richimandola in questo modo:
        E.S.
        let url = environment.exampleApi.format("P1","P2")
        quindi avviene una formattazione per posizione dei paraetri..
        exampleApi: `@cachable@/example/cacable/api?param1={0}&param2={1}`
    */
    exampleApi: `@cachable@/example/cache/api?param1={0}&param2={1}`,
    exampleApeNoCache: `example/no/cache/api?param1={0}&param2={1}`

  

>come si può notare, alla url è stato anteposto il **@cachable@** , questo sta ad indicare che la url dovrà essere sottoposta al motore di cache sia in chiamata verso la rete che in risposta verso il client.

  

>di default il tag da inserire è **@cacable** , si puo sostituire con qualsiasi valore, configurando opportunamente il servizio nel modulo di avvio dell'applicazione.

  

{ provide: MAX_CACHE_AGE, useValue: 300000 },

{ provide: CACHE_TAG, useValue: "@cachable@" }

  

> come per il tag, è possibile anche configurare il tempo valido per la cache.. scaduto il tempo la chiamata verrà eliminata dalla cache in modo da poter poi richiedere al BE nuovi aggiornamenti

  



  
  
  

## Esempi decoratori

   

    /**
        abilitazione del trace log dei cicli di hook delle classi,
        vengono loggati tutti i cicli di vita del componente
    */
    @PLTraceHooks( )
    export class AppComponent
 

    /**
        decoratore configurabile, se attivato, inibisce la creazione di componenti DOM in base a
        dei parametri lanciare
        document.dispatchEvent(new CustomEvent('PL:SET-PERMISSION', { detail
        [PROFILO1,PROFILO2,PROFILO3,...] }));
        inserire nel DOM <input permission="READONLY" type="text>"
        e al decoratore passare @PLPermission(true)
        l'elemento del dom viene elininato in quanto non contiene il permesso READONLY.
    */

    @PLPermission(environment.production)
    export class AppComponent

    /**
        esempio di funzionalita ritardata, la sua esecuzione avviene in modalita
        observer e dopo 3 secondi dalla sua chiamata.
    */

 

  
  

## Esempi di funzionalità aggiuntive

il codice viene corredato di funzionalità aggiuntive per String , Array, JSON si riporta un esempio di chiamata

    let user = {
        nome:"Luca" ,
        cognome: "Pic"
    }

    user=JSON.changeValuesByKey(user,"cognome","Piciollo");
    console.log(user);

> Verrà stampato l'oggetto - {nome : "Luca" , cognome: "Piciollo" }

>Le altre funzionalità vanno utilizzate allo stesso modo

  
  
  

    String {
        format: (...params) => string;
        isNullOrEmpty: (val: string) => boolean;
        truncateUrlIfNoParams: (val: any) => string;
        truncateUrlCache: (val: any) => string;
    }

  

    Array<T> {
        moveDown: (from) => void;
        moveTo: (from, to) => void;
        moveUp: (from) => void;
        delete: (position) => void;
        differences: (items) => Array<any>;
        inArray: (item) => Number;
        insert: (index: number, item: any) => void;
    }

  

    JSON {
        changeValues: (json,previousValue, nextValue) => any;
        changeValuesByKey: (json,key, nextValue) => any;
        findByValue: (json, value) => any;
        json2flat: (json) => any;
        json2array: (json) => any;
        json2flatObj: (json) => any;
        findKey: (json, keyFind) => any;
    }

  
  
  
  
  
  

## Esempio mock servizio

Viene mostrato come abilitare il mock di un servizio di BE, utile in caso si voglia simulare la risposta di un servizio ancora in fase di sviluppo

  

    /**
        esempio di chiamata http
    */

    callMock(p1: any, p2: any): Observable<any> {
        return new Observable<any>(obs => {
            let plHttpRequest: PlHttpRequest = new PlHttpRequest(
            environment.http.api.mock ,
            Object({ api: "api", files: "files" }),
            Object({ api: p1, files: p2 }),
            null);

        this.httpService.GETFILE(plHttpRequest, RESPONSE_TYPE.ARRAYBUFFER, null, null).subscribe(sb => {
            obs.next(sb);
            obs.complete()
        }, error => {
             obs.error(error);
         }, () => { })
      })
    }

dichiarare nel file di properties un oggetto cosi dichiarato,

> api esposta a scopo illustrativo

    /**
        @author l.piciollo
        è possibile dichiarare una chiamata ad un mock, si consiglia di rispettare il seguente formato dichiarativo
        E.S.
        mock: {
            url: "@cachable@/example/:api/:files",
            mocked: true,
            method:"GET"
        }
        il mock a true, impone al sistema di risalire alla folder                     
        assets/public/mock/example/no/cache/api/122 e prelevare il
        json relativo al metodo utilizzato.. quindi post||get||put||delete||patch .json
    */

    mock: {
        url: "@cachable@/example/:api/:files",
        mocked: true,
        method:"GET"
    }

  

creare una struttura di cartelle per ospitare i file stub. La struttura deve essere posta a partire dal path assets e deve avere cartelle e sottocartelle come il path della url, ovviamente escludendo i queryparams.

  

- per chiamate di tipo GET : **assets/public/mock/** example/:api/:file/**get.json**

- per chiamate di tipo POST: **assets/public/mock/** example/:api/:file/****post.json**

  

> i path url possono contenere variabili indicate con :nome, il sistema intercetterà automaticamente i path params e sostituira autonomamente questi valori con i valori dei path params passati nella request.

> Es.

  

    let plHttpRequest: PlHttpRequest = new PlHttpRequest( environment.http.api.mock , Object({ api: "api", files: "files" }), Object({ api: p1, files: p2 }), null);

le chiamate http necessitano in ingresso dell'oggetto plHttpRequest, il quale contiene la url da richiamare, i query params , del body params e del pathParams. Nell'esempio sopra, si vede che l'oggetto contiene Object({ api: "api", files: "files" }), le chiavi dell'oggetto devono corrispondere con il nome del path param e il valore, sarà quello che effettivamente sostituirà il nome.

  

e cosi per gli altri metodi

  

> è possibile anche mockare servizi con url contenenti path params, ad esempio /example/:id , in questo caso creare comunque l'alberatura sopra citata, escludendo i : nel nome della folder.

  

>è possibile cambiare il path di riferimento dei file di mock, ma che comunque siano sempre sotto assets, occorre aggiungere nel modulo di avvio la seguente istruzione

  

    /**
        inizializzazione del path per reperire gli stub json di risposta al mock
    */

    { provide: DEFAULT_PATH_MOCK, useValue: "nuovo/path" }

  
  
  
  
  
  
  
  
  
  

## Alcune funzionalità utili

E' possibile avvalersi di alcune funzionalità utili come la gestione delle immagini. Si riportano le funzionalità messe a disposizione per la gestione della grafica

  

    /**
        si occupa di convertire un immagine esposta tramite blob url, in formato base 64
        @param imageUrl
    */

    public image2base64(imageUrl: string): Promise<any>

    /**
        Funzione che esporta l'intero elemento svg in un file per la visualizzazione in un browser,
        verrà mantenuto fedelmente il costrutto
        dell'elemento SVG
        @param elementSVG : elemento svg da elaborare
        @param nameFIle : nome del file da salvare
    */

    public svg2File(elementSVG: HTMLElement, nameFIle: string): Observable<boolean>

    /**
        Funzine per la creazione del jpeg partendo da un dom.
        l'osservatore ritorna il link all'immagine per il download
        @param elementSVG elemento SVG dom da cattuare
    */

    public dom2jpeg(elementSVG: HTMLElement): Observable<string>

    /**
        Funzione per la creazione del canvas, contenente l'immagine del DOM referenziato. non verranno presi in considerazione
        tag SVG grafici. ma solo html semplice comprese le immagini
        la funzione restituisce in callback il canvas creato, in modo da poterlo aggiungere al dom o altro.
        mentre in observer torna la url da passare alla funaione di download
        @param elementoDom : elemento dom da cattuare
        @param call : callback di ritorno dove iniettare il canvas creato.
    */

    public domToCanvas(elementoDom: HTMLElement, call: (canvas: HTMLElement) => void): Observable<string>

  

    /**
        Funzione che si occupa di scaricare un'immagine da un contenitore canvas, il canvas deve contenere un immagine non un html.
        questa funzionalità puo essere usata in risposta a domToCanvas
        viene ritornata la URL del blob da poeter scaricare
        @param canvas :oggetto canvas da scaricare
    */

    public canvasToImg(canvas: HTMLElement): Observable<string>

  

    /**
        Funzionalita per la creazione di un immagine a partire da un svg. la funzione restituisce in callback un canvas eventualmente
        da mostrare a schermo e la url del file in formato blob nell'osservable
        @param svgElement : svg element del dom
        @param callBack : funzione di ritorno per la consegna del canvas
    */

    public svgToImage(svgElement: HTMLElement, call: (canvas) => void): Observable<any>

  
## Esempio message alert()

Introdotto un sistema di alert() custom, al momento della chiamata alla funzione alert() di window.. verrà scatenata una routine, che mostrerà una finestra di dialogo modale in formato bootstrap.  La funzionalità è nata per velocizzare la chiamata ad un message .

	showMessage(){
		alert(title,message);
	}  

![alt text](https://firebasestorage.googleapis.com/v0/b/pl-schematics.appspot.com/o/img%2FAlert.PNG?alt=media&token=98a8d646-41ae-4e59-9442-fae7a293d7fc)
    
come si puo vedere l'utilizzo della funzionalità è molto semplice e immediata.

E' possibile ritornare alla funzionalità predefinita di window, semplicemente disabilitandola.
 
	 constructor(private alertService: AlertService) {
		 this.alertService.enableAlertMessage(false);
	 }
	 

## PlBaseComponent

Componente nato per essere esteso, mette a disposizione funzionalità utili per la navigazione tramite routing. Qui è possibile passare parametri anche complessi via URL, dato che questi vengono codificate

    /** chiamata a menu con passaggio di parametri */
    export class HomeComponent extends PlBaseComponent{
        go() {
            this.goToPage("home/menu", null, { P1: "param1", p2: { param2: "param2" }, p3: { param3: "param3" } });
        }
    }

    /** lettura dei parametri arrivati */
    export class MenuComponent extends PlBaseComponent{
        ngOnInit() {
              this.queryParams.subscribe(user => {
                this.user = user;
                this.userName = String(Object.keys(user)[0]);
                this.pathDetailUser = user[(Object.keys(user)[0])];
              })
              this.data.subscribe(user => {
                .....
              })
              this.params.subscribe(user => {
                .....
              })
        }       
    }

> ES: http://localhost:4200/#/home?OBJ=eyJob21lMSI6ImNpYW8iLCJob21lMiI6ImNpYW8ifQ%3D%3D


#   Rxjs polling ed uuid

Tutti gli oservatori ora godono della nuova funzionalità di polling. Questa è utile specialmente a livello di chiamata HTTP su servizi di BE. La funzionalità si occupa di effettuare a ciclo continuo, ma configurando le condizioni, la richiesta all'observer di replicare nuovamente il suo funzionamento. QUindi applicato ad una chiamata rest, la stessa viene ripetuta fino al raggiungimento della condizione stabilita.

>   polling<T>(everyTime: number, forTime?: number, interrupt?: Subject<boolean> = new Subject()): Subject<T>

Per richiamare tale funzionalità occorre passare l'intervallo di tempo tra una ripetizione e l'altra, il valore che indica per quanto tempo deve essere attivo il polling, in millisecondi, indicare 0 per un ciclo infinito e in fine l'interrupt, un evento che al verificarsi blocca il processo di polling.
E' obbligatorio inserire oltre al everyTime, uno dei due parametri successivamente richiesti.
    
    /**
    * chiamata ad un servizio rest ogni secondo per un tempo complessivo di 6 secondi
    * il polling si interrompe in caso di riscontro di un cambio rotta di navigazione del portale.
    * Attenzione, la chiamata REST deve essere di tipo background altrimenti la GET semplice viene interrotta
    * al cambio rotta, quindi usare la GETBG o le altre, purche siano ..BG
    */
    let caller = <HTTPREQUEST>.polling(1000,6000, PlCoreModule.Routing().getIinterrupt() )).subscribe(
      val => console.log(val ),
      error => { console.error(error )},
      () => alert(caller.uuid)
    )

>   Attenzione: se il polling viene scatenato da un osservatore di tipo of(1,2,3), questo avrà effetto solo sul primo elemento e cioè 1. il polling è nato per osservatori che producono valori da un solo processo, come le chiamate a servizi di BE.. quindi non applicare ad osservatori come Timer, Interval o operatori simili.

Come si vede dal codice ogni osservatore o subscriber ha la proprietà uuid, la stessa viene valorizzata in automatico al momento della sua creazione. è possibile risalire ad essa semplicemente assegnando ad una variabile l'osservatore e prelevare il suo uuid

    let caller= <observer>;
    console.log(caller.uuid)

## Opzioni configurabili

è possibile procedere alla configurazione personale di alcuni servizi, come ad esempio il tag cache la durata della validità della stessa. Le configurazioni al momento disponibili sono

  

>{ provide: BROWSER_VALID, useValue: [BROWSER.ALL] },

  

>{ provide: DISABLE_LOG, useValue: false },

  

>{ provide: MAX_CACHE_AGE, useValue: 300000 },

  

>{ provide: CACHE_TAG, useValue: "@cachable@" },

  

>{ provide: DEFAULT_PATH_MOCK, useValue: "public/mock" }

  

## In questa versione

Questa versione della lib, contiene tutte le fix effettuate nelle precedenti e in piu, viene migliorata introducendo

  

 - modifica dell'interfaccia Rxjs per l'introduzione di una nuova funzionalità, applicabile agli osservatori "polling" e inserimento di un nuovo attributo per identificare tutti gli Observer "uuid"

  

Tutte le precedenti funzionalità sono rimaste invariate.

## Documentazione online
[Qui](https://pl-core-utils.web.app/index.html) è possibile fare riferimento alla documentazione on line delle libreria e delle sue funzionalità  

## Author

Created by @l.piciollo