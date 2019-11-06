import * as tm from "type-mapping";
import {ITable, InsertableTable, TableUtil} from "../../../table";
import {InsertIgnoreManyConnection, InsertIgnoreManyResult} from "../../connection";
import {InsertRow, InsertUtil} from "../../../insert";

/**
 * Inserts zero-to-many rows
 * ```sql
 *  INSERT IGNORE INTO
 *      myTable (...column_list)
 *  VALUES
 *      ...row_list;
 * ```
 */
export async function insertIgnoreMany<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreManyConnection,
    rows : readonly InsertRow<TableT>[]
) : (
    Promise<InsertIgnoreManyResult>
) {
    TableUtil.assertInsertEnabled(table);

    if (rows.length == 0) {
        return {
            query : {
                /**
                 * No rows were inserted.
                 * No SQL string was execute.
                 */
                sql : "",
            },
            insertedRowCount : tm.BigInt(0),
            /**
             * Should this be considered a warning?
             * Probably not.
             */
            warningCount : tm.BigInt(0),
            message : "No rows to insert",
        };
    }
    return connection.insertIgnoreMany(
        table,
        rows.map(
            row => InsertUtil.cleanInsertRow(table, row)
        ) as [InsertRow<TableT>, ...InsertRow<TableT>[]]
    );
}
