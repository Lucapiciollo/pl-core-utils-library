/**
 * @author @l.piciollo
 * @email l.piciollo@gmail.com
 * @create date 2019-12-22 12:09:07
 * @modify date 2019-12-22 12:09:07
 * @desc [interfaccia per la specializzazione di dunzionalita native dei browser 
 * utile per risalire alle funzionalità messe a disposizione dal sistema core e evita che il compilatore vada in errore
 * per funzionalità non trovate.]
 */
 

 interface String {
    format: (...params:any) => string;
    isNullOrEmpty: (val: string) => boolean;
    truncateUrlIfNoParams: (val: any) => string;
    truncateUrlCache: (val: any) => string;
}

interface Array<T> {
    moveDown: (from:number) => void;
    moveTo: (from:number, to:number) => void;
    moveUp: (from:number) => void;
    delete: (position:number) => void;
    differences: (items:any) => Array<any>;
    inArray: (item:any) => Number;
    insert: (index: number, item: any) => void;
}

interface JSON     { 
    changeValues: (json:any,previousValue:any, nextValue:any) => any;
    changeValuesByKey: (json:any,key:any, nextValue:any) => any;
    findByValue: (json:any, value:any) => any;
    json2flat: (json:any) => any;
    json2array: (json:any) => any;
    json2flatObj: (json:any) => any;
    findKey: (json:any, keyFind:any) => any;
}




