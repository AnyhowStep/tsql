import {LockCallback} from "./lockable";
import {IsolationLevel} from "../../../isolation-level";
import {IsolatedSelectConnection} from "../isolable-connection";

export interface ReadOnlyTransactionIfNotInOne {
    readOnlyTransactionIfNotInOne<ResultT> (
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
    readOnlyTransactionIfNotInOne<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
}
