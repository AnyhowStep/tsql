import {SelectConnection, DeleteConnection} from "./connection";

/**
 * A callback containing an isolated connection.
 */
export type IsolatedCallback<K, ResultT> = (
    (connection : K & IsolatedConnection<K>) => Promise<ResultT>
);
/**
 * Allows you to use transactions for isolating queries.
 */
export interface IsolableConnection<K> {
    /**
     * Tells you if this connection is in a transaction.
     */
    isInTransaction () : this is IsolatedConnection<K>;
    /**
     * Enters a transaction.
     *
     * Will throw an error if already inside a transaction.
     * Nesting transactions is not allowed.
     */
    transaction<ResultT> (
        callback : IsolatedCallback<K, ResultT>
    ) : Promise<ResultT>;
    /**
     * Enters a transaction, if not already in one.
     * If already in a transaction, it uses the current transaction.
     */
    transactionIfNotInOne<ResultT> (
        callback : IsolatedCallback<K, ResultT>
    ) : Promise<ResultT>;
}
/**
 * A connection that is isolated in a transaction.
 */
export interface IsolatedConnection<K> extends IsolableConnection<K> {
    rollback () : Promise<void>;
    commit () : Promise<void>;
}

/**
 * + Allows `SELECT` statements
 * +
 */
export type IsolableSelectConnection = (
    & SelectConnection
    & IsolableConnection<SelectConnection>
);

/**
 * + Allows `SELECT/DELETE` statements
 * +
 */
export type IsolableDeleteConnection = (
    & DeleteConnection
    & IsolableConnection<DeleteConnection>
);
