import {IConnection, ITransactionConnection} from "../connection";

export type ConnectionCallback<ResultT> = (
    (connection : IConnection) => Promise<ResultT>
);
export type TransactionCallback<ResultT> = (
    (connection : ITransactionConnection) => Promise<ResultT>
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

    disconnect () : Promise<void>;
}
