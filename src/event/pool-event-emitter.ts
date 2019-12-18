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

    getHandlers () : readonly EventHandler<EventT>[];
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
    getHandlers () : readonly EventHandler<EventT>[] {
        return this.handlers;
    }
}

export interface IConnectionEventEmitter<EventT extends IEventBase> {
    invoke (event : (EventT & OnCommitOrRollbackListenerCollection)) : Promise<void>;
}

export class ConnectionEventEmitter<EventT extends IEventBase> implements IConnectionEventEmitter<EventT> {
    private readonly poolEventEmitter : IPoolEventEmitter<EventT>;
    private readonly addEventImpl : (event : OnCommitOrRollbackListenerCollection) => void;
    constructor (
        poolEventEmitter : IPoolEventEmitter<EventT>,
        addEventImpl : (event : OnCommitOrRollbackListenerCollection) => void
    ) {
        this.poolEventEmitter = poolEventEmitter;
        this.addEventImpl = addEventImpl;
    }

    /**
     * This may throw
     */
    async invoke (event : (EventT & OnCommitOrRollbackListenerCollection)) : Promise<void> {
        this.addEventImpl(event);
        for (const handler of this.poolEventEmitter.getHandlers()) {
            await handler(event);
        }
    }
}
