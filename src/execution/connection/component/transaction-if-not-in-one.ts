import {LockCallback} from "./lockable";
import {IsolationLevel} from "../../../isolation-level";

export interface TransactionIfNotInOne<ConnectionT> {
    transactionIfNotInOne<ResultT> (
        callback : LockCallback<ConnectionT, ResultT>
    ) : Promise<ResultT>;
    transactionIfNotInOne<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<ConnectionT, ResultT>
    ) : Promise<ResultT>;
}
