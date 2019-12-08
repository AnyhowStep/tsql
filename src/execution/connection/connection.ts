import {TransactionCallback} from "../pool";
import {IQueryBase, QueryBaseUtil} from "../../query-base";
import {InsertableTable, DeletableTable, ITable} from "../../table";
import {BuiltInInsertRow} from "../../insert";
import {InsertSelectRow} from "../../insert-select";
import {WhereClause} from "../../where-clause";
import {BuiltInAssignmentMap} from "../../update";
import {SchemaMeta} from "../../schema-introspection";

export interface RawQueryResult {
    query   : { sql : string },
    results : unknown|undefined,
    columns : string[]|undefined,
}
export interface SelectResult {
    query   : { sql : string },
    rows    : Record<string, unknown>[],
    columns : string[],
}
export interface InsertOneResult {
    query : { sql : string },

    //alias for affectedRows on MySQL
    insertedRowCount : 1n;

    /**
     * If the table has an `AUTO_INCREMENT`/`SERIAL` column, it returns `> 0n`.
     * Else, it returns `undefined`.
     *
     * If multiple rows are inserted, there is no guarantee that `insertId` will be set.
     *
     * -----
     *
     * If you explicitly set the value of the `AUTO_INCREMENT` column,
     * should there be a guarantee that it is set to the explicit value?
     *
     * Using MySQL's `LAST_INSERT_ID()` returns `0`, in this case.
     * But the library should be able to infer...
     */
    //alias for `insertId` in MySQL
    autoIncrementId : bigint|undefined;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export interface InsertManyResult {
    query : {
        /**
         * Is an empty string if no rows were inserted.
         */
        sql : string
    },

    //alias for affectedRows on MySQL
    insertedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export interface IgnoredInsertOneResult {
    query : { sql : string },

    //alias for affectedRows on MySQL
    insertedRowCount : 0n;

    /**
     * No rows were inserted. So, there cannot be an `autoIncrementId`.
     */
    //alias for `insertId` in MySQL
    autoIncrementId : undefined;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export type InsertIgnoreOneResult =
    | IgnoredInsertOneResult
    | InsertOneResult
;
export interface InsertIgnoreManyResult {
    query : {
        /**
         * Is an empty string if no rows were inserted.
         */
        sql : string
    },

    //alias for affectedRows on MySQL
    insertedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export interface ReplaceOneResult {
    query : { sql : string },

    /**
     * We can't tell if the row was inserted, or if it was replaced.
     */
    //alias for affectedRows on MySQL
    insertedOrReplacedRowCount : 1n;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export interface ReplaceManyResult {
    query : { sql : string },

    /**
     * We can't tell if the row was inserted, or if it was replaced.
     */
    //alias for affectedRows on MySQL
    insertedOrReplacedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export interface DeleteResult {
    query : { sql : string },

    //Alias for affectedRows
    deletedRowCount : bigint;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export interface UpdateResult {
    query : { sql : string },

    //Alias for affectedRows
    foundRowCount : bigint;

    /**
     * You cannot trust this number for SQLite.
     * SQLite thinks that all found rows are updated, even if you set `x = x`.
     *
     * @todo Consider renaming this to `unreliableUpdatedRowCount`?
     */
    //Alias for changedRows
    updatedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export type LockCallback<ResultT> = (
    (connection : IConnection) => Promise<ResultT>
);
export interface IConnection {
    lock<ResultT> (
        callback : LockCallback<ResultT>
    ) : Promise<ResultT>;

    isInTransaction () : this is ITransactionConnection;
    transaction<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;
    transactionIfNotInOne<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;

    rawQuery (sql : string) : Promise<RawQueryResult>;
    select (query : IQueryBase) : Promise<SelectResult>;

    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertOne<TableT extends InsertableTable> (table : TableT, row : BuiltInInsertRow<TableT>) : Promise<InsertOneResult>;
    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertMany<TableT extends InsertableTable> (table : TableT, rows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]) : Promise<InsertManyResult>;

    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertIgnoreOne<TableT extends InsertableTable> (table : TableT, row : BuiltInInsertRow<TableT>) : Promise<InsertIgnoreOneResult>;
    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertIgnoreMany<TableT extends InsertableTable> (table : TableT, rows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]) : Promise<InsertIgnoreManyResult>;

    replaceOne<TableT extends InsertableTable & DeletableTable> (table : TableT, row : BuiltInInsertRow<TableT>) : Promise<ReplaceOneResult>;
    replaceMany<TableT extends InsertableTable & DeletableTable> (table : TableT, rows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]) : Promise<ReplaceManyResult>;

    insertSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause,
        TableT extends InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<InsertManyResult>;
    insertIgnoreSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause,
        TableT extends InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<InsertIgnoreManyResult>;
    replaceSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause,
        TableT extends InsertableTable & DeletableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<ReplaceManyResult>;

    delete (table : DeletableTable, whereClause : WhereClause) : Promise<DeleteResult>;

    update<TableT extends ITable> (
        table : TableT,
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>
    ) : Promise<UpdateResult>;

    /**
     *
     * @param schemaAlias - If `undefined`, it uses the implied schema of the connection
     */
    tryFetchSchemaMeta (schemaAlias : string|undefined) : Promise<SchemaMeta|undefined>;
}
export interface ITransactionConnection extends IConnection {
    rollback () : Promise<void>;
    commit () : Promise<void>;
}

export type RestrictedLockCallback<T, ResultT> =
    (connection : T & RestrictedLockableConnection<T>) => Promise<ResultT>
;

export interface RestrictedLockableConnection<T> {
    lock<ResultT> (
        callback : RestrictedLockCallback<T, ResultT>
    ) : Promise<ResultT>
}

export type RestrictedConnection<K extends keyof IConnection> =
    & Pick<IConnection, K>
    & RestrictedLockableConnection<Pick<IConnection, K>>
;

/**
 * Only `SELECT` statements can be executed by this connection.
 */
export type SelectConnection = RestrictedConnection<"select">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertOneConnection = RestrictedConnection<"select"|"insertOne">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertManyConnection = RestrictedConnection<"select"|"insertMany">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertIgnoreOneConnection = RestrictedConnection<"select"|"insertIgnoreOne">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertIgnoreManyConnection = RestrictedConnection<"select"|"insertIgnoreMany">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type ReplaceOneConnection = RestrictedConnection<"select"|"replaceOne">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type ReplaceManyConnection = RestrictedConnection<"select"|"replaceMany">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertSelectConnection = RestrictedConnection<"select"|"insertSelect">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type InsertIgnoreSelectConnection = RestrictedConnection<"select"|"insertIgnoreSelect">;

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export type ReplaceSelectConnection = RestrictedConnection<"select"|"replaceSelect">;

/**
 * `DELETE` and `SELECT` statements can be executed by this connection.
 */
export type DeleteConnection = RestrictedConnection<"select"|"delete">;

/**
 * `UPDATE` and `SELECT` statements can be executed by this connection.
 */
export type UpdateConnection = RestrictedConnection<"select"|"update">;
