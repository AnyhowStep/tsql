import {IEventBase} from "./event-base";

export interface EventHandler<EventT extends IEventBase> {
    (event : EventT) : void|Promise<void>;
}
