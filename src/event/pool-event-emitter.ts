import {IEventBase} from "./event-base";
import {EventHandler} from "./event-handler";

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
