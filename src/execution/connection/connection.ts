import {TransactionCallback} from "../pool";
import {IQueryBase} from "../../query-base";

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
export interface InsertResult {
    fieldCount   : number;
    affectedRows : number;
    insertId     : bigint;
    serverStatus : number;
    warningCount : number;
    message      : string;
    protocol41   : boolean;
    changedRows  : number;

    //alias for affectedRows
    insertedRowCount : number;
}
export interface RawUpdateResult {
    fieldCount   : number;
    affectedRows : number;
    //Should always be zero
    insertId     : number;
    serverStatus : number;
    warningCount : number;
    message      : string;
    protocol41   : boolean;
    changedRows  : number;

    /*
        Prefixed with `raw` because MySQL is weird
        with how it returns results.
    */
    //Alias for affectedRows
    rawFoundRowCount : number;
    //Alias for changedRows
    rawUpdatedRowCount : number;
}
export interface UpdateResult extends RawUpdateResult {
    updatedTableCount : number;
    /*
        foundRowCount = rawFoundRowCount / updatedTableCount
    */
    foundRowCount : number;
    /*
        We cannot reasonably derive this value
        in the general case.

        With multiple tables, especially.
        Refer to
        execution/input/update/multi-4 and
        execution/input/update/multi-6

        They have the same updateResult but update
        very different rows.

        If updatedTableCount == 1,
        then you may use rawUpdatedRowCount
        as the "real" number of rows updated.
    */
    //updatedRowCount : number;
}
export type UpdateZeroOrOneResult = (
    UpdateResult &
    (
        { foundRowCount : 0, updatedRowCount : 0 } |
        { foundRowCount : 1, updatedRowCount : 0|1 }
    )
);
export type UpdateOneResult = (
    UpdateResult &
    { foundRowCount : 1, updatedRowCount : 0|1 }
);
export interface RawDeleteResult {
    fieldCount   : number;
    affectedRows : number;
    //Should always be zero
    insertId     : number;
    serverStatus : number;
    warningCount : number;
    message      : string;
    protocol41   : boolean;
    //Should always be zero
    changedRows  : number;

    //Alias for affectedRows + warningCount
    rawFoundRowCount : number;
    //Alias for affectedRows
    rawDeletedRowCount : number;
}
export interface DeleteResult extends RawDeleteResult {
    deletedTableCount : number;
    /*
        In general, we cannot deduce this correctly.
    */
    //foundRowCount
    //deletedRowCount
}
//Not used with IGNORE modifier. Therefore, found == deleted
export type DeleteZeroOrOneResult = (
    DeleteResult &
    (
        { foundRowCount : 0, deletedRowCount : 0 } |
        { foundRowCount : 1, deletedRowCount : 1 }
    )
);
//Not used with IGNORE modifier. Therefore, found == deleted
export type DeleteOneResult = (
    DeleteResult &
    { foundRowCount : 1, deletedRowCount : 1 }
);

export interface IConnection {
    isInTransaction () : this is ITransactionConnection;
    transaction<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;
    transactionIfNotInOne<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;

    rawQuery (sql : string) : Promise<RawQueryResult>;
    select (query : IQueryBase) : Promise<SelectResult>;
    insert (sql : string) : Promise<InsertResult>;
    update (sql : string) : Promise<RawUpdateResult>;
    delete (sql : string) : Promise<RawDeleteResult>;
}
export interface ITransactionConnection extends IConnection {
    rollback () : Promise<void>;
    commit () : Promise<void>;
}
