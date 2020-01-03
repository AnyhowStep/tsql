import {LockCallback} from "./lockable";

export interface Savepoint<LockT> {
    savepoint<ResultT> (
        callback : LockCallback<LockT, ResultT>
    ) : Promise<ResultT>;
}
