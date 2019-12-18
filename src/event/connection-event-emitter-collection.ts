import {IPool} from "../execution";
import {IConnectionEventEmitter, ConnectionEventEmitter, OnCommitOrRollbackListenerCollection} from "./pool-event-emitter";
import {IInsertOneEvent} from "./insert-one-event";
import {ITable} from "../table";

export interface IConnectionEventEmitterCollection {
    readonly onInsertOne : IConnectionEventEmitter<IInsertOneEvent<ITable>>;

    flushOnCommit () : { syncErrors : unknown[] };
    flushOnRollback () : { syncErrors : unknown[] };
}

export class ConnectionEventEmitterCollection implements IConnectionEventEmitterCollection {
    /**
     * We want to avoid mutating arrays because it may mess up our loops.
     * We might add/remove events while invoking a handler.
     */
    private events : readonly (OnCommitOrRollbackListenerCollection)[] = [];

    readonly onInsertOne : ConnectionEventEmitter<IInsertOneEvent<ITable>>;

    private readonly addEventImpl = (event : OnCommitOrRollbackListenerCollection) => {
        this.events = [...this.events, event];
    };

    constructor (pool : IPool) {
        this.onInsertOne = new ConnectionEventEmitter<IInsertOneEvent<ITable>>(
            pool.onInsertOne,
            this.addEventImpl
        );
    }

    /**
     * This should not throw
     */
    flushOnCommit () : { syncErrors : unknown[] } {
        const syncErrors : unknown[] = [];
        const events = this.events;
        this.events = [];
        for (const event of events) {
            const invokeResult = event.invokeOnCommitListeners();
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
        const events = this.events;
        this.events = [];
        for (const event of events) {
            const invokeResult = event.invokeOnRollbackListeners();
            syncErrors.push(
                ...invokeResult.syncErrors
            );
        }
        return { syncErrors };
    }
}
