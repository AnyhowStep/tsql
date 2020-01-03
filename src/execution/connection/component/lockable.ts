
export interface LockCallback<LockT, ResultT> {
    (connection : LockT) : Promise<ResultT>
}

export interface Lockable<LockT> {
    lock<ResultT> (
        callback : LockCallback<LockT, ResultT>
    ) : Promise<ResultT>;
}
