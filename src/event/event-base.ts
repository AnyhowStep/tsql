import {IPool, IConnection} from "../execution";
import {IReadonlyTransactionListenerCollection} from "./transaction-listener-collection";

export interface IEventBase {
    readonly pool : IPool;
    readonly connection : IConnection;

    addOnCommitListener (listener : () => void) : void;
    addOnRollbackListener (listener : () => void) : void;
}

export class EventBase implements IEventBase, IReadonlyTransactionListenerCollection {
    readonly pool : IPool;
    readonly connection : IConnection;

    constructor (args : {
        readonly connection : IConnection;
    }) {
        this.pool = args.connection.pool;
        this.connection = args.connection;
    }

    private onCommitListeners : readonly (() => void)[] = [];
    private onRollbackListeners : readonly (() => void)[] = [];
    /**
     * If the `listener` has already been added, it will be ignored.
     */
    addOnCommitListener (listener : () => void) : void {
        if (this.onCommitListeners.includes(listener)) {
            /**
             * We do not want duplicate listener references.
             */
            return;
        }
        this.onCommitListeners = [...this.onCommitListeners, listener];
    }
    /**
     * If the `listener` has already been added, it will be ignored.
     */
    addOnRollbackListener (listener : () => void) : void {
        if (this.onRollbackListeners.includes(listener)) {
            /**
             * We do not want duplicate listener references.
             */
            return;
        }
        this.onRollbackListeners = [...this.onRollbackListeners, listener];
    }
    /**
     * For now,
     * + This should not throw.
     * + This must not wait for `async` listeners to complete.
     * + This will not catch `async` errors.
     *
     * @returns - All synchronous errors.
     */
    invokeOnCommitListeners () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];

        for (const listener of this.onCommitListeners) {
            try {
                listener();
            } catch (err) {
                syncErrors.push(err);
            }
        }

        return { syncErrors };
    }
    /**
     * For now,
     * + This should not throw.
     * + This must not wait for `async` listeners to complete.
     * + This will not catch `async` errors.
     *
     * @returns - All synchronous errors.
     */
    invokeOnRollbackListeners () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];

        for (const listener of this.onRollbackListeners) {
            try {
                listener();
            } catch (err) {
                syncErrors.push(err);
            }
        }

        return { syncErrors };
    }
}
