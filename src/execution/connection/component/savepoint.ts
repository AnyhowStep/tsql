import {LockCallback} from "./lockable";

export interface InSavepoint {
    rollbackToSavepoint () : Promise<void>;
    releaseSavepoint () : Promise<void>;
}
export interface Savepoint<LockT> {
    savepoint<ResultT> (
        callback : LockCallback<LockT & InSavepoint, ResultT>
    ) : Promise<ResultT>;
}
