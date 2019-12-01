import {InsertableTable, TableUtil, DeletableTable} from "../../../table";
import {ReplaceOneResult, ReplaceOneConnection} from "../../connection";
import {CustomInsertRow, InsertUtil} from "../../../insert";

/**
 * Only inserts/replaces one row
 * ```sql
 *  REPLACE INTO
 *      myTable (...column_list)
 *  VALUES
 *      (...value_list);
 * ```
 *
 * The table must allow both `INSERT` and `DELETE`.
 * Replacing a row is essentially deleting the old row and inserting a new row.
 */
export async function replaceOne<
    TableT extends InsertableTable & DeletableTable
> (
    table : TableT,
    connection : ReplaceOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<ReplaceOneResult>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertDeleteEnabled(table);

    row = InsertUtil.cleanInsertRow(table, row);

    return connection.replaceOne(table, row);
}
