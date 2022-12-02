import { Observable } from "rxjs/internal/Observable";
import { ObservableInput, ObservedValueOf, Observer, OperatorFunction } from "rxjs/internal/types";



export const log = <T>(
    observerOrNext?: Observer<T> | ((value: T) => void) | null,
    error?: ((e: any) => void) | null,
    complete?: (() => void) | null
) => {

    return (observable: Observable<T>) => new Observable<T>((subscriber) => {
        const subscription = observable.subscribe({
            next(value) {
                throw new Error("test")
                console.log(value);
                subscriber.next(value)
            }, error(value) {
                console.log(value);
            }, complete() {
                console.log("complete");
            }
        })
    })



}






/* export function hasLift(source: any): source is { lift: InstanceType<typeof Observable>['lift'] } {
    return typeof source?.lift === 'function'
} */

/**
 * Creates an `OperatorFunction`. Used to define operators throughout the library in a concise way.
 * @param init The logic to connect the liftedSource to the subscriber at the moment of subscription.
 */
/* export function operate<T, R>(init: (liftedSource: Observable<T>, subscriber: Subscriber<R>) => (() => void) | void): OperatorFunction<T, R> {
    return (source: Observable<T>) => {
        if (typeof source?.lift === 'function') {
            return source.lift(function (this: Subscriber<R>, liftedSource: Observable<T>) {
                try {
                    return init(liftedSource, this);
                } catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
} */