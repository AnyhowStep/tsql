import {InsertableTable, DeletableTable} from "../../../table";
import {BuiltInInsertRow} from "../../../insert";

export interface ReplaceOneResult {
    query : { sql : string },

    /**
     * We can't tell if the row was inserted, or if it was replaced.
     */
    //alias for affectedRows on MySQL
    insertedOrReplacedRowCount : 1n;

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

export interface ReplaceOne {
    replaceOne<TableT extends InsertableTable & DeletableTable> (
        table : TableT,
        row : BuiltInInsertRow<TableT>
    ) : Promise<ReplaceOneResult>;
}
