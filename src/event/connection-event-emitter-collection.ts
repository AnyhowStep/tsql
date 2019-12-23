import {IPool} from "../execution";
import {IInsertOneEvent} from "./insert-one-event";
import {ITable} from "../table";
import {IReadonlyTransactionListenerCollection} from "./transaction-listener-collection";
import {IConnectionEventEmitter, ConnectionEventEmitter} from "./connection-event-emitter";
import {IUpdateEvent} from "./update-event";

export interface IConnectionEventEmitterCollection {
    readonly onInsertOne : IConnectionEventEmitter<IInsertOneEvent<ITable>>;
    readonly onUpdate : IConnectionEventEmitter<IUpdateEvent<ITable>>;

    flushOnCommit () : { syncErrors : unknown[] };
    flushOnRollback () : { syncErrors : unknown[] };
}

export class ConnectionEventEmitterCollection implements IConnectionEventEmitterCollection {
    /**
     * We want to avoid mutating arrays because it may mess up our loops.
     * We might add/remove events while invoking a handler.
     */
    private transactionListenerCollections : readonly IReadonlyTransactionListenerCollection[] = [];

    readonly onInsertOne : ConnectionEventEmitter<IInsertOneEvent<ITable>>;
    readonly onUpdate : ConnectionEventEmitter<IUpdateEvent<ITable>>;

    private readonly addTransactionListenerCollectionImpl = (event : IReadonlyTransactionListenerCollection) => {
        this.transactionListenerCollections = [...this.transactionListenerCollections, event];
    };

    constructor (pool : IPool) {
        this.onInsertOne = new ConnectionEventEmitter<IInsertOneEvent<ITable>>(
            pool.onInsertOne,
            this.addTransactionListenerCollectionImpl
        );
        this.onUpdate = new ConnectionEventEmitter<IUpdateEvent<ITable>>(
            pool.onUpdate,
            this.addTransactionListenerCollectionImpl
        );
    }

    /**
     * This should not throw
     */
    flushOnCommit () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];
        const collections = this.transactionListenerCollections;
        this.transactionListenerCollections = [];
        for (const collection of collections) {
            const invokeResult = collection.invokeOnCommitListeners();
            syncErrors.push(
                ...invokeResult.syncErrors
            );
        }
        return { syncErrors };
    }

    /**
     * This should not throw
     */
    flushOnRollback () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];
        const collections = this.transactionListenerCollections;
        this.transactionListenerCollections = [];
        for (const collection of collections) {
            const invokeResult = collection.invokeOnRollbackListeners();
            syncErrors.push(
                ...invokeResult.syncErrors
            );
        }
        return { syncErrors };
    }
}
