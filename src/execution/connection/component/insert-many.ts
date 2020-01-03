import {InsertableTable} from "../../../table";
import {BuiltInInsertRow} from "../../../insert";

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

export interface InsertMany {
    /**
     * This does not allow custom data types.
     * All custom data types must be wrapped by an expression.
     */
    insertMany<TableT extends InsertableTable> (
        table : TableT,
        rows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]
    ) : Promise<InsertManyResult>;

}
