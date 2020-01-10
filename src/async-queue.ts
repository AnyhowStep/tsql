import {invokeAsyncCallbackSafely} from "./promise-util";

export class AsyncQueueStoppingError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, AsyncQueueStoppingError.prototype);
    }
}
AsyncQueueStoppingError.prototype.name = "AsyncQueueStoppingError";

export type AllocateDelegate<ItemT> =
    () => {
        item : ItemT,
        deallocate : () => Promise<void>
    }
;
/**
 * Only one `ItemT` can be allocated at a time.
 * Only one enqueued callback can be running at a time.
 *
 * This can be used to implement `IConnection.lock()`
 */
export class AsyncQueue<ItemT> {
    private readonly allocateDelegate: AllocateDelegate<ItemT>;

    constructor (
        allocateDelegate: AllocateDelegate<ItemT>,
    ) {
        this.allocateDelegate = allocateDelegate;
    }

    private shouldStop = false;
    private lastPromise : Promise<unknown> = Promise.resolve();

    private deallocateErr : any = undefined;

    /**
     * Enqueues a callback that will be run asynchronously.
     *
     * Only one callback will be running at any given time.
     */
    enqueue = <ResultT>(callback: (item: ItemT) => Promise<ResultT>): Promise<ResultT> => {
        if (this.shouldStop) {
            return Promise.reject(new AsyncQueueStoppingError(
                "The async queue is stopping, or has stopped"
            ));
        }
        if (this.deallocateErr != undefined) {
            /**
             * We should not enqueue anymore callbacks,
             * our allocator/deallocator has run into problems.
             */
            return Promise.reject(this.deallocateErr);
        }

        const runCallback = () : Promise<ResultT> => {
            /**
             * It's okay if this throws because we execute
             * `runCallback` inside of a `.then()`
             */
            const {item, deallocate} = this.allocateDelegate();

            return invokeAsyncCallbackSafely(
                () => callback(item),
                (result) => {
                    return invokeAsyncCallbackSafely(
                        deallocate,
                        () => result,
                        (deallocateErr) => {
                            this.deallocateErr = deallocateErr;
                            return result;
                        }
                    );
                },
                (callbackErr) => {
                    return invokeAsyncCallbackSafely(
                        deallocate,
                        () => Promise.reject(callbackErr),
                        (deallocateErr) => {
                            this.deallocateErr = deallocateErr;
                            return Promise.reject(callbackErr);
                        }
                    );
                }
            );
        };
        const callbackPromise = this.lastPromise.then(
            runCallback,
            runCallback
        );
        this.lastPromise = callbackPromise;
        return callbackPromise;
    };

    /**
     * This makes all future calls to `.enqueue()` throw a run-time error.
     *
     * Returns a promise that resolves when the last enqueued
     * callback resolves.
     */
    stop = (): Promise<void> => {
        this.shouldStop = true;
        return this.lastPromise.then(
            () => { },
            () => { }
        );
    }

    getShouldStop () {
        return this.shouldStop;
    }


    /**
     * Enqueues a callback that will be run asynchronously.
     * This callback will be given another `AsyncQueue` instance.
     *
     * This `AsyncQueue` will wait for the other instance to
     * complete before continuing.
     *
     * Only one callback will be running at any given time.
     */
    lock = <ResultT>(callback: (nestedAsyncQueue : AsyncQueue<ItemT>) => Promise<ResultT>): Promise<ResultT> => {
        if (this.shouldStop) {
            return Promise.reject(new AsyncQueueStoppingError(
                "The async queue is stopping, or has stopped"
            ));
        }
        if (this.deallocateErr != undefined) {
            /**
             * We should not enqueue anymore callbacks,
             * our allocator/deallocator has run into problems.
             */
            return Promise.reject(this.deallocateErr);
        }

        const runCallback = () : Promise<ResultT> => {
            const nestedAsyncQueue = new AsyncQueue(this.allocateDelegate);

            return invokeAsyncCallbackSafely(
                () => callback(nestedAsyncQueue),
                (result) => {
                    const onStop = () => {
                        /**
                         * Copy over the `deallocateErr` because
                         * they share the same `allocateDelegate`
                         */
                        this.deallocateErr = nestedAsyncQueue.deallocateErr;
                        return result;
                    };
                    /**
                     * Calling `.stop()` should never throw a synchronous error...
                     * I think.
                     */
                    return nestedAsyncQueue.stop()
                        .then(
                            onStop,
                            onStop
                        );
                },
                (callbackErr) => {
                    const onStop = () => {
                        /**
                         * Copy over the `deallocateErr` because
                         * they share the same `allocateDelegate`
                         */
                        this.deallocateErr = nestedAsyncQueue.deallocateErr;
                        return Promise.reject(callbackErr);
                    };
                    /**
                     * Calling `.stop()` should never throw a synchronous error...
                     * I think.
                     */
                    return nestedAsyncQueue.stop()
                        .then(
                            onStop,
                            onStop
                        );
                }
            );
        };
        const callbackPromise = this.lastPromise.then(
            runCallback,
            runCallback
        );
        this.lastPromise = callbackPromise;
        return callbackPromise;
    };
}
