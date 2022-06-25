 import "reflect-metadata";
import * as moment from "moment"


import { v4 as uuidv4 } from 'uuid';
import { Singleton } from "pl-decorator";
@Singleton
class DependencyManager {
    private deps: Record<string, <T extends new (...args: any[]) => any>() => {}> = {};
    set(k: string, clazz: <T extends new (...args: any[]) => any>() => {}) {
        if (!(k in this.deps)) {
            this.deps[k] = clazz;
        }
    }

    get(k: string): <T extends new (...args: any[]) => any>() => {} {
        if (k in this.deps) {
            return this.deps[k];
        } return null
    }
}
/****************************************************************************************************************** */
const manager = new DependencyManager();
/****************************************************************************************************************** */

const colorTrace = (msg: any) => {
    // @ts-ignore
    console.log("%c" + [moment().format("HH:mm:ss"), ...msg].join(" "), "color: red; ");
}
/**
 * @author l.piciollo
 * @param type 
 * @returns 
 * @description Decorator class for indicate that propertie is injected 
 */
export const Inject = <T extends new (...args: any[]) => any>(type: any) => {
    return (target: any, key: string) => {
        let typeClassName = type.name;
        let value = target[key];
        let nameCass = target.constructor.name
        Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                let myClassInstance = manager.get(typeClassName);
                if (myClassInstance && (<any>myClassInstance).injectable) {
                    (<any>myClassInstance).singleton = true;
                    return myClassInstance;
                }
                colorTrace([` ${typeClassName} is not injectable, delete @Inject(${typeClassName}) on attribure ${key} in ${nameCass}`].join(" "))
                throw new Error(`### ${typeClassName} is not injectable ###`)
            }
        })
    }
}

/**
 * @author l.piciollo
 * @param type 
 * @returns 
 * @description Decorator class for indicate that class is injectable. All properties that is injected signed.. will be instanced
 */
export const Injectable = <T extends new (...args: any[]) => any>(type: any) => {
    let instance = new type();
    Object.defineProperty(instance, "instanceID", { value: uuidv4(), writable: false });
    Object.defineProperty(instance, "injectable", { value: true, writable: false });
    if (manager.get(type.prototype.constructor.name) == null) {
        manager.set(type.prototype.constructor.name, instance);
    }
    return new Proxy(type, {
        construct(target, argsList, newTarget) {

            if (target.prototype !== newTarget.prototype)
                return Reflect.construct(target, argsList, newTarget);

            if (type && type.prototype.injectable == true && type.prototype.singleton == true) {
                target = manager.get(type.prototype.constructor.name);
            }
            else {
                target = Reflect.construct(target, argsList, newTarget);
                Object.defineProperty(target, "instanceID", { value: uuidv4(), writable: false });
                Object.defineProperty(target, "injectable", { value: false, writable: false });
            }
            return target;
        }
    });
}

