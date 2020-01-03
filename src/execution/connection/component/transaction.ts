import {LockCallback} from "./lockable";
import {IsolationLevel} from "../../../isolation-level";

export interface Transaction<ConnectionT> {
    transaction<ResultT> (
        callback : LockCallback<ConnectionT, ResultT>
    ) : Promise<ResultT>;
    transaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : LockCallback<ConnectionT, ResultT>
    ) : Promise<ResultT>;
}
