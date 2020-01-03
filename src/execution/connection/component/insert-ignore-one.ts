import {InsertableTable} from "../../../table";
import {BuiltInInsertRow} from "../../../insert";
import {InsertOneResult} from "./insert-one";

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

export interface InsertIgnoreOne {
    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertIgnoreOne<TableT extends InsertableTable> (
        table : TableT,
        row : BuiltInInsertRow<TableT>
    ) : Promise<InsertIgnoreOneResult>;
}
