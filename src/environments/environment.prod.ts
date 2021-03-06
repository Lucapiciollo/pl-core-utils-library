/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-22 14:44:48
 * @modify date 2019-12-22 14:44:48
 * @desc [vengono inserite tutte le variabili d'ambiente ed eventuali puntamenti al BE o link vari. questo file deve essere
 * popolato con i dati relativi all'ambiente di produzione]
 */

export const environment = {
  production: true,
  /**
   * @author l.piciollo
   * chiave preimpostata, da valorizzare con il puntamento al BE.. ne fa uso il cor applicativo
   * E.S http://localhost:8080/
   */
  baseUrlRemoteApi: "",
    
  http: {
    /**
     * @author l.piciollo
     * inserire qui le chiamate al BE, è possibile effettuare delle sotto categorie 
     */
    api: {
      /**
       *  @author l.piciollo
       *  si riporta un esempio di una api riconosciuta come storable, grazie al tag @cachable@ presente nella URL.
       *  si nota come i parametri sono passati con {0} e {1}.. il sistema è equipagiato da una funzionalita che specializza
       *  le stringhe ad avere il format function.. quindi .. è possibile formattare la url richimandola in questo modo:
       *  E.S. 
       *    let url = environment.exampleApi.format("P1","P2")
       *    quindi avviene una formattazione per posizione dei paraetri..
       *  
       *  exampleApi: `@cachable@/example/cacable/api?param1={0}&param2={1}`
       */
      exampleApi: `@cachable@/example/cacable/api?param1={0}&param2={1}`,
      exampleApeNoCache: `example/no/cache/api?param1={0}&param2={1}`,
      /**
       *  @author l.piciollo
       *  è possibile dichiarare una chiamata ad un mock, si consiglia di rispettare il seguente formato dichiarativo
       *  E.S. 
       *    mock:{
       *            url: "/example/no/cache/api/122?param1={0}&param2={1}" ,
       *            mock: true
       *    }  
       *    il mock a true, impone al sistema di risalire alla folder assets/public/mock/example/no/cache/api/122 e prelevare il 
       *    json relativo al metodo utilizzato.. quindi post||get||put||delete||patch .json
       *  
       */
      mock: {
        url: "/example/:api/:files",
        mocked: true,
        method:"GET"
      }
    }
  }
};