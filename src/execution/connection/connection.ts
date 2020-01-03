import {IPool} from "../pool";
import {IConnectionEventEmitterCollection} from "../../event";
import {
    TryGetFullConnection,
    Lockable,
    TransactionIfNotInOne,
    ReadOnlyTransactionIfNotInOne,
    RawQuery,
    Select,
    InsertOne,
    InsertMany,
    InsertIgnoreOne,
    InsertIgnoreMany,
    ReplaceOne,
    ReplaceMany,
    InsertSelect,
    InsertIgnoreSelect,
    ReplaceSelect,
    Delete,
    Update,
    Transaction,
    InTransaction,
    IsInTransaction,
    ReadOnlyTransaction,
    TryFetchSchemaMeta,
    TryFetchGeneratedColumnExpression,
} from "./component";

export interface IConnection extends
    TryGetFullConnection,
    Lockable<IConnection>,
    TransactionIfNotInOne<ITransactionConnection>,
    ReadOnlyTransactionIfNotInOne,
    RawQuery,
    Select,
    InsertOne,
    InsertMany,
    InsertIgnoreOne,
    InsertIgnoreMany,
    ReplaceOne,
    ReplaceMany,
    InsertSelect,
    InsertIgnoreSelect,
    ReplaceSelect,
    Delete,
    Update,
    TryFetchSchemaMeta,
    TryFetchGeneratedColumnExpression,
    Transaction<ITransactionConnection>,
    ReadOnlyTransaction,
    IsInTransaction<ITransactionConnection>
{
    readonly pool : IPool;
    readonly eventEmitters : IConnectionEventEmitterCollection;
}
export interface ITransactionConnection extends
    TryGetFullConnection,
    Lockable<ITransactionConnection>,
    TransactionIfNotInOne<ITransactionConnection>,
    ReadOnlyTransactionIfNotInOne,
    RawQuery,
    Select,
    InsertOne,
    InsertMany,
    InsertIgnoreOne,
    InsertIgnoreMany,
    ReplaceOne,
    ReplaceMany,
    InsertSelect,
    InsertIgnoreSelect,
    ReplaceSelect,
    Delete,
    Update,
    TryFetchSchemaMeta,
    TryFetchGeneratedColumnExpression,
    Transaction<ITransactionConnection>,
    ReadOnlyTransaction,
    InTransaction,
    IsInTransaction<ITransactionConnection>
{
    readonly pool : IPool;
    readonly eventEmitters : IConnectionEventEmitterCollection;
}

/**
 * Only `SELECT` statements can be executed by this connection.
 */
export interface SelectConnection extends
    Lockable<SelectConnection>,
    Select
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertOneConnection extends
    TryGetFullConnection,
    Lockable<InsertOneConnection>,
    Select,
    InsertOne
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertManyConnection extends
    TryGetFullConnection,
    Lockable<InsertManyConnection>,
    Select,
    InsertMany
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertIgnoreOneConnection extends
    TryGetFullConnection,
    Lockable<InsertIgnoreOneConnection>,
    Select,
    InsertIgnoreOne
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertIgnoreManyConnection extends
    TryGetFullConnection,
    Lockable<InsertIgnoreManyConnection>,
    Select,
    InsertIgnoreMany
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface ReplaceOneConnection extends
    TryGetFullConnection,
    Lockable<ReplaceOneConnection>,
    Select,
    ReplaceOne
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface ReplaceManyConnection extends
    TryGetFullConnection,
    Lockable<ReplaceManyConnection>,
    Select,
    ReplaceMany
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertSelectConnection extends
    TryGetFullConnection,
    Lockable<InsertSelectConnection>,
    Select,
    InsertSelect
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface InsertIgnoreSelectConnection extends
    TryGetFullConnection,
    Lockable<InsertIgnoreSelectConnection>,
    Select,
    InsertIgnoreSelect
{

}

/**
 * `INSERT` and `SELECT` statements can be executed by this connection.
 */
export interface ReplaceSelectConnection extends
    TryGetFullConnection,
    Lockable<ReplaceSelectConnection>,
    Select,
    ReplaceSelect
{

}

/**
 * `DELETE` and `SELECT` statements can be executed by this connection.
 */
export interface DeleteConnection extends
    TryGetFullConnection,
    Lockable<DeleteConnection>,
    Select,
    Delete
{

}


/**
 * `UPDATE` and `SELECT` statements can be executed by this connection.
 */
export interface UpdateConnection extends
    TryGetFullConnection,
    Lockable<UpdateConnection>,
    Select,
    Update
{

}
