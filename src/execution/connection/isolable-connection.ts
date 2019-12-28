import {SelectConnection, DeleteConnection, UpdateConnection, InsertOneConnection, IConnection} from "./connection";

export type IsolableLockCallback<T, ResultT> = (
    (connection : T & IsolableConnection<T>) => Promise<ResultT>
);
/**
 * A callback containing an isolated connection.
 */
export type IsolatedCallback<T, ResultT> = (
    (connection : T & IsolatedConnection<T>) => Promise<ResultT>
);
/**
 * Allows you to use transactions for isolating queries.
 */
export interface IsolableConnection<T> {
    tryGetFullConnection () : IConnection|undefined;

    lock<ResultT> (
        callback : IsolableLockCallback<T, ResultT>
    ) : Promise<ResultT>;

    tryFetchGeneratedColumnExpression (
        schemaAlias : string|undefined,
        tableAlias : string,
        columnAlias : string
    ) : Promise<string|undefined>;

    /**
     * Tells you if this connection is in a transaction.
     */
    isInTransaction () : this is IsolatedConnection<T>;
    /**
     * Enters a transaction.
     *
     * Will throw an error if already inside a transaction.
     * Nesting transactions is not allowed.
     */
    transaction<ResultT> (
        callback : IsolatedCallback<T, ResultT>
    ) : Promise<ResultT>;
    /**
     * Enters a transaction, if not already in one.
     * If already in a transaction, it uses the current transaction.
     */
    transactionIfNotInOne<ResultT> (
        callback : IsolatedCallback<T, ResultT>
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
export type IsolableSelectConnection =
    /**
     * The order of operands is important here!
     * Intersections are not commutative in TypeScript!
     */
    & IsolableConnection<SelectConnection>
    & SelectConnection
;

/**
 * + Allows `SELECT/INSERT` statements
 * +
 */
export type IsolableInsertOneConnection =
    /**
     * The order of operands is important here!
     * Intersections are not commutative in TypeScript!
     */
    & IsolableConnection<InsertOneConnection>
    & InsertOneConnection
;

/**
 * + Allows `SELECT/DELETE` statements
 * +
 */
export type IsolableDeleteConnection =
    /**
     * The order of operands is important here!
     * Intersections are not commutative in TypeScript!
     */
    & IsolableConnection<DeleteConnection>
    & DeleteConnection
;

/**
 * + Allows `SELECT/UPDATE` statements
 * +
 */
export type IsolableUpdateConnection =
    /**
     * The order of operands is important here!
     * Intersections are not commutative in TypeScript!
     */
    & IsolableConnection<UpdateConnection>
    & UpdateConnection
;
