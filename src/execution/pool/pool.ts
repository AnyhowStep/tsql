import {IConnection, ITransactionConnection, SelectConnection, IsolatedConnection} from "../connection";
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
} from "../../event";
import {IsolationLevel} from "../../isolation-level";

export type ConnectionCallback<ResultT> = (
    (connection : IConnection) => Promise<ResultT>
);
export type TransactionCallback<ResultT> = (
    (connection : ITransactionConnection) => Promise<ResultT>
);
export type ReadOnlyTransactionCallback<ResultT> = (
    (connection : SelectConnection & IsolatedConnection<SelectConnection>) => Promise<ResultT>
);
/*
    All connections **should** set @@SESSION.time_zone to "+00:00"
*/
export interface IPool {
    acquire<ResultT> (
        callback : ConnectionCallback<ResultT>
    ) : Promise<ResultT>;

    acquireTransaction<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;
    acquireTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;

    acquireReadOnlyTransaction<ResultT> (
        callback : ReadOnlyTransactionCallback<ResultT>
    ) : Promise<ResultT>;
    acquireReadOnlyTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : ReadOnlyTransactionCallback<ResultT>
    ) : Promise<ResultT>;

    disconnect () : Promise<void>;

    readonly onInsert : IPoolEventEmitter<IInsertEvent<ITable>>;
    readonly onInsertOne : IPoolEventEmitter<IInsertOneEvent<ITable>>;
    readonly onInsertAndFetch : IPoolEventEmitter<IInsertAndFetchEvent<ITable>>;

    readonly onReplace : IPoolEventEmitter<IReplaceEvent<ITable>>;

    readonly onUpdate : IPoolEventEmitter<IUpdateEvent<ITable>>;
    readonly onUpdateAndFetch : IPoolEventEmitter<IUpdateAndFetchEvent<ITable>>;

    readonly onDelete : IPoolEventEmitter<IDeleteEvent<ITable>>;
}
