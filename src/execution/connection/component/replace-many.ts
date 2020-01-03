import {InsertableTable, DeletableTable} from "../../../table";
import {BuiltInInsertRow} from "../../../insert";

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

export interface ReplaceMany {
    replaceMany<TableT extends InsertableTable & DeletableTable> (
        table : TableT,
        rows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]
    ) : Promise<ReplaceManyResult>;
}
