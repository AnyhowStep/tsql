interface AsyncItem {
    readonly deallocate? : () => void|Promise<void>
}
interface PendingPromise<ItemT> {
    resolve : (item : ItemT) => void,
    reject : (err : Error) => void,
}
/**
 * Only one `ItemT` can be allocated at a time.
 */
export class AsyncQueue<ItemT> {
    private executingCallback : (Promise<unknown>)|undefined = undefined;
    private allocatedItem : ItemT|undefined = undefined;
    private promiseQueue : undefined|PendingPromise<ItemT>[] = [];
    constructor (
        private readonly allocateDelegate : () => ItemT,
    ) {

    }
    private tryAllocateNext () {
        if (this.promiseQueue == undefined) {
            return;
        }
        if (this.allocatedItem != undefined) {
            return;
        }
        const promise = this.promiseQueue.shift();
        if (promise == undefined) {
            return;
        } else {
            this.allocatedItem = this.allocateDelegate();
            promise.resolve(this.allocatedItem);
        }
    }
    private enqueue (promise : PendingPromise<ItemT>) {
        if (this.promiseQueue == undefined) {
            throw new Error(`This async queue is stopping`);
        }
        if (this.promiseQueue.length == 0) {
            /**
             * No need to wait because we have no other item allocated.
             */
            this.promiseQueue.push(promise);
            this.tryAllocateNext();
        } else {
            /**
             * We need to wait. We have something else allocated at the moment.
             */
            this.promiseQueue.push(promise);
        }
    }
    private async deallocate (item : AsyncItem) {
        if (typeof item.deallocate == "function" && item.deallocate.length == 0) {
            await item.deallocate();
        }
        this.allocatedItem = undefined;
        this.tryAllocateNext();
    }
    private waitForItem () : Promise<ItemT> {
        return new Promise<ItemT>((resolve, reject) => {
            this.enqueue({resolve, reject});
        });
    }

    acquire = <ResultT>(callback : (item : ItemT) => Promise<ResultT>) : Promise<ResultT> => {
        return new Promise<ResultT>((resolve, reject) => {
            this.waitForItem()
                .then((item) => {
                    const promise = callback(item);
                    this.executingCallback = promise;

                    promise
                        .then((result) => {
                            this.executingCallback = undefined;
                            resolve(result);
                            this.deallocate(item)
                                .catch(console.error);
                        })
                        .catch((error) => {
                            this.executingCallback = undefined;
                            reject(error);
                            this.deallocate(item)
                                .catch(console.error);
                        });
                })
                .catch((error) => {
                    /**
                     * We encountered an error before even
                     * allocating an item.
                     */
                    reject(error);
                });
        });
    };

    private stopPromise : Promise<void>|undefined;
    stop () : Promise<void> {
        if (this.stopPromise != undefined) {
            /**
             * We have already called `stop()`
             */
            return this.stopPromise;
        }

        const promiseQueue = this.promiseQueue;
        /**
         * Immediately make it so no other promises may be enqueued.
         */
        this.promiseQueue = undefined;

        this.stopPromise = new Promise<void>((resolve) => {
            if (promiseQueue != undefined) {
                /**
                 * Reject all pending promises.
                 */
                for (const promise of promiseQueue) {
                    promise.reject(new Error(`The async queue will stop`));
                }
            }

            if (this.executingCallback == undefined) {
                resolve();
            } else {
                /**
                 * We have to wait for it to finish executing.
                 */
                this.executingCallback
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        resolve();
                    });
            }
        });
        return this.stopPromise;
    }
}
