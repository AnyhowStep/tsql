import * as tm from "type-mapping";
import {InsertableTable, TableUtil, DeletableTable} from "../../../table";
import {ReplaceManyConnection, ReplaceManyResult} from "../../connection";
import {CustomInsertRow, BuiltInInsertRow, InsertUtil} from "../../../insert";

/**
 * Inserts/Replaces zero-to-many rows
 * ```sql
 *  REPLACE INTO
 *      myTable (...column_list)
 *  VALUES
 *      ...row_list;
 * ```
 */
export async function replaceMany<
    TableT extends InsertableTable & DeletableTable
> (
    table : TableT,
    connection : ReplaceManyConnection,
    rows : readonly CustomInsertRow<TableT>[]
) : (
    Promise<ReplaceManyResult>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertDeleteEnabled(table);

    if (rows.length == 0) {
        return {
            query : {
                /**
                 * No rows were inserted.
                 * No SQL string was execute.
                 */
                sql : "",
            },
            insertedOrReplacedRowCount : tm.BigInt(0),
            /**
             * Should this be considered a warning?
             * Probably not.
             */
            warningCount : tm.BigInt(0),
            message : "No rows to insert",
        };
    }
    return connection.replaceMany(
        table,
        rows.map(
            row => InsertUtil.cleanInsertRow(table, row)
        ) as [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]]
    );
}
