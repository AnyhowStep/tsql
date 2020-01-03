import {LockCallback} from "./lockable";
import {IsolationLevel} from "../../../isolation-level";
import {IsolatedSelectConnection} from "../isolable-connection";

export interface ReadOnlyTransaction {
    readOnlyTransaction<ResultT> (
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
    readOnlyTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
}
