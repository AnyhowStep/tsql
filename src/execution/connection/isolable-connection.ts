import {
    Lockable,
    TryGetFullConnection,
    TransactionIfNotInOne,
    ReadOnlyTransactionIfNotInOne,
    InsertOne,
    Select,
    InTransaction,
    IsInTransaction,
    TryFetchGeneratedColumnExpression,
    Update,
    Delete,
} from "./component";

/**
 * + Allows `SELECT` statements
 * +
 */
export interface IsolableSelectConnection extends
    Lockable<IsolableSelectConnection>,
    ReadOnlyTransactionIfNotInOne,
    IsInTransaction<IsolatedSelectConnection>,
    Select
{

}

export interface IsolatedSelectConnection extends
    Lockable<IsolatedSelectConnection>,
    ReadOnlyTransactionIfNotInOne,
    InTransaction,
    IsInTransaction<IsolatedSelectConnection>,
    Select
{

}


/**
 * + Allows `SELECT/INSERT` statements
 * +
 */
export interface IsolableInsertOneConnection extends
    Lockable<IsolableInsertOneConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedInsertOneConnection>,
    IsInTransaction<IsolatedInsertOneConnection>,
    Select,
    InsertOne,
    TryFetchGeneratedColumnExpression,
    TryGetFullConnection
{

}

export interface IsolatedInsertOneConnection extends
    Lockable<IsolatedInsertOneConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedInsertOneConnection>,
    IsInTransaction<IsolatedInsertOneConnection>,
    InTransaction,
    Select,
    InsertOne,
    TryFetchGeneratedColumnExpression,
    TryGetFullConnection
{

}

/**
 * + Allows `SELECT/DELETE` statements
 * +
 */
export interface IsolableDeleteConnection extends
    Lockable<IsolableDeleteConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedDeleteConnection>,
    IsInTransaction<IsolatedDeleteConnection>,
    Select,
    Delete,
    TryGetFullConnection
{

}

export interface IsolatedDeleteConnection extends
    Lockable<IsolatedDeleteConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedDeleteConnection>,
    IsInTransaction<IsolatedDeleteConnection>,
    InTransaction,
    Select,
    Delete,
    TryFetchGeneratedColumnExpression,
    TryGetFullConnection
{

}

/**
 * + Allows `SELECT/UPDATE` statements
 * +
 */
export interface IsolableUpdateConnection extends
    Lockable<IsolableUpdateConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedUpdateConnection>,
    IsInTransaction<IsolatedUpdateConnection>,
    Select,
    Update,
    TryGetFullConnection
{

}

export interface IsolatedUpdateConnection extends
    Lockable<IsolatedUpdateConnection>,
    ReadOnlyTransactionIfNotInOne,
    TransactionIfNotInOne<IsolatedUpdateConnection>,
    IsInTransaction<IsolatedUpdateConnection>,
    InTransaction,
    Select,
    Update,
    TryGetFullConnection
{

}
