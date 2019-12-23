import {IEventBase} from "./event-base";
import {IReadonlyTransactionListenerCollection} from "./transaction-listener-collection";
import {IPoolEventEmitter} from "./pool-event-emitter";

export interface IConnectionEventEmitter<EventT extends IEventBase> {
    invoke (event : (EventT & IReadonlyTransactionListenerCollection)) : Promise<void>;
}

export class ConnectionEventEmitter<EventT extends IEventBase> implements IConnectionEventEmitter<EventT> {
    private readonly poolEventEmitter : IPoolEventEmitter<EventT>;
    private readonly addEventImpl : (event : IReadonlyTransactionListenerCollection) => void;
    constructor (
        poolEventEmitter : IPoolEventEmitter<EventT>,
        addTransactionListenerCollectionImpl : (event : IReadonlyTransactionListenerCollection) => void
    ) {
        this.poolEventEmitter = poolEventEmitter;
        this.addEventImpl = addTransactionListenerCollectionImpl;
    }

    /**
     * This may throw
     */
    async invoke (event : (EventT & IReadonlyTransactionListenerCollection)) : Promise<void> {
        const handlers = this.poolEventEmitter.getHandlers();
        if (handlers.length == 0) {
            /**
             * There are no handlers.
             * There's nothing for us to do here.
             */
            return;
        }
        //This should not throw.
        this.addEventImpl(event);
        //This loop may throw.
        for (const handler of handlers) {
            await handler(event);
        }
    }
}
