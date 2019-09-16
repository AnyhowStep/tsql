export type ToPromise<T> =
    T extends PromiseLike<infer U> ?
    Promise<U> :
    Promise<T>
;
