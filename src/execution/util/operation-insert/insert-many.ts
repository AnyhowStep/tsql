import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {InsertManyResult, InsertManyConnection} from "../../connection";
import {InsertRow, InsertUtil} from "../../../insert";

/**
 * Inserts one-to-many rows
 * ```sql
 *  INSERT INTO
 *      myTable (...column_list)
 *  VALUES
 *      ...row_list;
 * ```
 */
export async function insertMany<
    TableT extends ITable
> (
    connection : InsertManyConnection,
    table : TableT,
    rows : readonly InsertRow<TableT>[]
) : (
    Promise<InsertManyResult>
) {
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
    return connection.insertMany(
        table,
        rows.map(
            row => InsertUtil.cleanInsertRow(table, row)
        ) as [InsertRow<TableT>, ...InsertRow<TableT>[]]
    );
}
