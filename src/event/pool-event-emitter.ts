import {IPool, IConnection} from "../execution";

export interface IEventBase {
    readonly pool : IPool;
    readonly connection : IConnection;

    addOnCommitListener (listener : () => void) : void;
    addOnRollbackListener (listener : () => void) : void;
}

/**
 * @todo Better name
 */
export interface OnCommitOrRollbackListenerCollection {
    /**
     * This should not throw
     */
    invokeOnCommitListeners () : { syncErrors : unknown[] };
    /**
     * This should not throw
     */
    invokeOnRollbackListeners () : { syncErrors : unknown[] };
}

export class EventBase implements IEventBase, OnCommitOrRollbackListenerCollection {
    readonly pool : IPool;
    readonly connection : IConnection;

    constructor (args : {
        readonly pool : IPool;
        readonly connection : IConnection;
    }) {
        this.pool = args.pool;
        this.connection = args.connection;
    }

    private onCommitListeners : readonly (() => void)[] = [];
    private onRollbackListeners : readonly (() => void)[] = [];
    addOnCommitListener (listener : () => void) : void {
        this.onCommitListeners = [...this.onCommitListeners, listener];
    }
    addOnRollbackListener (listener : () => void) : void {
        this.onRollbackListeners = [...this.onRollbackListeners, listener];
    }
    /**
     * This should not throw
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
     * This should not throw
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

export interface EventHandler<EventT extends IEventBase> {
    (event : EventT) : void|Promise<void>;
}

export interface IPoolEventEmitter<EventT extends IEventBase> {
    addHandler (handler : EventHandler<EventT>) : void;
    removeHandler (handler : EventHandler<EventT>) : void;
}

export class PoolEventEmitter<EventT extends IEventBase> implements IPoolEventEmitter<EventT> {
    /**
     * We want to avoid mutating arrays because it may mess up our loops.
     * We might add/remove handlers while invoking a handler.
     */
    private handlers : readonly EventHandler<EventT>[] = [];

    addHandler (handler : EventHandler<EventT>) : void {
        this.handlers = [...this.handlers, handler];
    }
    removeHandler (handler : EventHandler<EventT>) : void {
        while (true) {
            const index = this.handlers.indexOf(handler);
            if (index < 0) {
                return;
            }
            this.handlers = [
                ...this.handlers.slice(0, index),
                ...this.handlers.slice(index+1),
            ];
        }
    }
    /**
     * This may throw
     */
    private invoke = async (event : EventT) : Promise<void> => {
        for (const handler of this.handlers) {
            await handler(event);
        }
    };

    createConnectionEventEmitter () : ConnectionEventEmitter<EventT> {
        return new ConnectionEventEmitter<EventT>(this.invoke);
    }
}

export interface IConnectionEventEmitter<EventT extends IEventBase> {
    invoke (event : (EventT & OnCommitOrRollbackListenerCollection)) : Promise<void>;
}

export class ConnectionEventEmitter<EventT extends IEventBase> implements IConnectionEventEmitter<EventT> {
    private readonly invokeImpl : (event : EventT) => Promise<void>;
    constructor (
        invokeImpl : (event : EventT) => Promise<void>
    ) {
        this.invokeImpl = invokeImpl;
    }
    /**
     * We want to avoid mutating arrays because it may mess up our loops.
     * We might add/remove events while invoking a handler.
     */
    private events : readonly (OnCommitOrRollbackListenerCollection)[] = [];

    /**
     * This may throw
     */
    async invoke (event : (EventT & OnCommitOrRollbackListenerCollection)) : Promise<void> {
        this.events = [...this.events, event];
        return this.invokeImpl(event);
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
