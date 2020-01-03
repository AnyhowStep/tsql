import {IPool} from "../execution";
import {ITable} from "../table";
import {IReadonlyTransactionListenerCollection} from "./transaction-listener-collection";
import {IConnectionEventEmitter, ConnectionEventEmitter} from "./connection-event-emitter";
import {IInsertEvent} from "./insert-event";
import {IInsertOneEvent} from "./insert-one-event";
import {IInsertAndFetchEvent} from "./insert-and-fetch-event";
import {IReplaceEvent} from "./replace-event";
import {IUpdateEvent} from "./update-event";
import {IUpdateAndFetchEvent} from "./update-and-fetch-event";
import {IDeleteEvent} from "./delete-event";

export interface IConnectionEventEmitterCollection {
    readonly onInsert : IConnectionEventEmitter<IInsertEvent<ITable>>;
    readonly onInsertOne : IConnectionEventEmitter<IInsertOneEvent<ITable>>;
    readonly onInsertAndFetch : IConnectionEventEmitter<IInsertAndFetchEvent<ITable>>;

    readonly onReplace : IConnectionEventEmitter<IReplaceEvent<ITable>>;

    readonly onUpdate : IConnectionEventEmitter<IUpdateEvent<ITable>>;
    readonly onUpdateAndFetch : IConnectionEventEmitter<IUpdateAndFetchEvent<ITable>>;

    readonly onDelete : IConnectionEventEmitter<IDeleteEvent<ITable>>;

    savepoint () : void;
    releaseSavepoint () : void;
    rollbackToSavepoint () : { syncErrors : unknown[] };

    commit () : { syncErrors : unknown[] };
    rollback () : { syncErrors : unknown[] };
}

export class ConnectionEventEmitterCollection implements IConnectionEventEmitterCollection {
    /**
     * We want to avoid mutating arrays because it may mess up our loops.
     * We might add/remove events while invoking a handler.
     */
    private transactionListenerCollections : readonly [
        readonly IReadonlyTransactionListenerCollection[],
        ...(readonly IReadonlyTransactionListenerCollection[])[]
    ] = [
        []
    ];

    /**
     * @todo Better name
     *
     * Used whenever a savepoint is created
     */
    savepoint () {
        this.transactionListenerCollections = [
            ...this.transactionListenerCollections,
            []
        ] as [unknown] as (
            readonly [
                readonly IReadonlyTransactionListenerCollection[],
                ...(readonly IReadonlyTransactionListenerCollection[])[]
            ]
        );
    }
    /**
     * @todo Better name
     *
     * Used whenever a savepoint is released
     */
    releaseSavepoint () {
        if (this.transactionListenerCollections.length == 1) {
            throw new Error(`Cannot unnest top-level transaction listener collection`);
        }
        const bottom = this.transactionListenerCollections[this.transactionListenerCollections.length-1];
        const parent = this.transactionListenerCollections[this.transactionListenerCollections.length-2];
        const ancestors = this.transactionListenerCollections.slice(
            0,
            this.transactionListenerCollections.length-2
        );
        this.transactionListenerCollections = [
            ...ancestors,
            [
                ...parent,
                ...bottom
            ]
        ] as [unknown] as (
            readonly [
                readonly IReadonlyTransactionListenerCollection[],
                ...(readonly IReadonlyTransactionListenerCollection[])[]
            ]
        );
    }
    /**
     * @todo Better name
     *
     * Used whenever a savepoint is rolled back
     */
    rollbackToSavepoint () : { syncErrors : unknown[] } {
        if (this.transactionListenerCollections.length == 1) {
            throw new Error(`Cannot unnest top-level transaction listener collection`);
        }

        const bottom = this.transactionListenerCollections[this.transactionListenerCollections.length-1];
        const parentAndAncestors = this.transactionListenerCollections.slice(
            0,
            this.transactionListenerCollections.length-1
        );
        this.transactionListenerCollections = parentAndAncestors as [unknown] as (
            readonly [
                readonly IReadonlyTransactionListenerCollection[],
                ...(readonly IReadonlyTransactionListenerCollection[])[]
            ]
        );

        const syncErrors : unknown[] = [];
        for (const collection of bottom) {
            const invokeResult = collection.invokeOnRollbackListeners();
            syncErrors.push(
                ...invokeResult.syncErrors
            );
        }
        return { syncErrors };
    }

    readonly onInsert : IConnectionEventEmitter<IInsertEvent<ITable>>;
    readonly onInsertOne : ConnectionEventEmitter<IInsertOneEvent<ITable>>;
    readonly onInsertAndFetch : IConnectionEventEmitter<IInsertAndFetchEvent<ITable>>;

    readonly onReplace : IConnectionEventEmitter<IReplaceEvent<ITable>>;

    readonly onUpdate : ConnectionEventEmitter<IUpdateEvent<ITable>>;
    readonly onUpdateAndFetch : ConnectionEventEmitter<IUpdateAndFetchEvent<ITable>>;

    readonly onDelete : IConnectionEventEmitter<IDeleteEvent<ITable>>;

    private readonly addTransactionListenerCollectionImpl = (event : IReadonlyTransactionListenerCollection) => {
        const bottom = this.transactionListenerCollections[this.transactionListenerCollections.length-1];
        const parentAndAncestors = this.transactionListenerCollections.slice(
            0,
            this.transactionListenerCollections.length-1
        );
        this.transactionListenerCollections = [
            ...parentAndAncestors,
            [
                ...bottom,
                event
            ]
        ] as [unknown] as (
            readonly [
                readonly IReadonlyTransactionListenerCollection[],
                ...(readonly IReadonlyTransactionListenerCollection[])[]
            ]
        );
    };

    constructor (pool : IPool) {
        this.onInsert = new ConnectionEventEmitter<IInsertEvent<ITable>>(
            pool.onInsert,
            this.addTransactionListenerCollectionImpl
        );
        this.onInsertOne = new ConnectionEventEmitter<IInsertOneEvent<ITable>>(
            pool.onInsertOne,
            this.addTransactionListenerCollectionImpl
        );
        this.onInsertAndFetch = new ConnectionEventEmitter<IInsertAndFetchEvent<ITable>>(
            pool.onInsertAndFetch,
            this.addTransactionListenerCollectionImpl
        );

        this.onReplace = new ConnectionEventEmitter<IReplaceEvent<ITable>>(
            pool.onReplace,
            this.addTransactionListenerCollectionImpl
        );

        this.onUpdate = new ConnectionEventEmitter<IUpdateEvent<ITable>>(
            pool.onUpdate,
            this.addTransactionListenerCollectionImpl
        );
        this.onUpdateAndFetch = new ConnectionEventEmitter<IUpdateAndFetchEvent<ITable>>(
            pool.onUpdateAndFetch,
            this.addTransactionListenerCollectionImpl
        );

        this.onDelete = new ConnectionEventEmitter<IDeleteEvent<ITable>>(
            pool.onDelete,
            this.addTransactionListenerCollectionImpl
        );
    }

    /**
     * This should not throw
     *
     * Used when a transaction is committed
     */
    commit () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];
        const scopes = this.transactionListenerCollections;
        this.transactionListenerCollections = [[]];
        for (const scope of scopes) {
            for (const collection of scope) {
                const invokeResult = collection.invokeOnCommitListeners();
                syncErrors.push(
                    ...invokeResult.syncErrors
                );
            }
        }
        return { syncErrors };
    }

    /**
     * This should not throw
     *
     * Used when a transaction is rolled back
     */
    rollback () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];
        const scopes = this.transactionListenerCollections;
        this.transactionListenerCollections = [[]];
        for (const scope of scopes) {
            for (const collection of scope) {
                const invokeResult = collection.invokeOnRollbackListeners();
                syncErrors.push(
                    ...invokeResult.syncErrors
                );
            }
        }
        return { syncErrors };
    }
}
