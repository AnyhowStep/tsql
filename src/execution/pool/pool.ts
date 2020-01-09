import {IConnection, ITransactionConnection, IsolatedSelectConnection} from "../connection";
import {ITable} from "../../table";
import {
    IPoolEventEmitter,
    IInsertEvent,
    IInsertOneEvent,
    IUpdateEvent,
    IUpdateAndFetchEvent,
    IDeleteEvent,
    IInsertAndFetchEvent,
    IReplaceEvent,
    IReplaceOneEvent,
} from "../../event";
import {IsolationLevel} from "../../isolation-level";
import {LockCallback} from "../connection/component";

export type ConnectionCallback<ResultT> = (
    (connection : IConnection) => Promise<ResultT>
);
/*
    All connections **should** set @@SESSION.time_zone to "+00:00"
*/
export interface IPool {
    acquire<ResultT> (
        callback : ConnectionCallback<ResultT>
    ) : Promise<ResultT>;

    acquireTransaction<ResultT> (
        callback : LockCallback<ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    acquireTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<ITransactionConnection, ResultT>
    ) : Promise<ResultT>;

    acquireReadOnlyTransaction<ResultT> (
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
    acquireReadOnlyTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;

    disconnect () : Promise<void>;

    readonly onInsert : IPoolEventEmitter<IInsertEvent<ITable>>;
    readonly onInsertOne : IPoolEventEmitter<IInsertOneEvent<ITable>>;
    readonly onInsertAndFetch : IPoolEventEmitter<IInsertAndFetchEvent<ITable>>;

    readonly onReplace : IPoolEventEmitter<IReplaceEvent<ITable>>;
    readonly onReplaceOne : IPoolEventEmitter<IReplaceOneEvent<ITable>>;

    readonly onUpdate : IPoolEventEmitter<IUpdateEvent<ITable>>;
    readonly onUpdateAndFetch : IPoolEventEmitter<IUpdateAndFetchEvent<ITable>>;

    readonly onDelete : IPoolEventEmitter<IDeleteEvent<ITable>>;
}
