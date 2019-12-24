export interface IReadonlyTransactionListenerCollection {
    /**
     * For now,
     * + This should not throw.
     * + This must not wait for `async` listeners to complete.
     * + This will not catch `async` errors.
     *
     * @returns - All synchronous errors.
     */
    invokeOnCommitListeners () : { syncErrors : unknown[] };
    /**
     * For now,
     * + This should not throw.
     * + This must not wait for `async` listeners to complete.
     * + This will not catch `async` errors.
     *
     * @returns - All synchronous errors.
     */
    invokeOnRollbackListeners () : { syncErrors : unknown[] };
}
