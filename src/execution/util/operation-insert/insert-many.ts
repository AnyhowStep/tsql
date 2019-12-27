import * as tm from "type-mapping";
import {ITable, InsertableTable, TableUtil} from "../../../table";
import {InsertManyResult, InsertManyConnection} from "../../connection";
import {CustomInsertRow, InsertUtil, BuiltInInsertRow} from "../../../insert";
import {InsertEvent} from "../../../event";

/**
 * Inserts zero-to-many rows
 * ```sql
 *  INSERT INTO
 *      myTable (...column_list)
 *  VALUES
 *      ...row_list;
 * ```
 */
export async function insertMany<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertManyConnection,
    rows : readonly CustomInsertRow<TableT>[]
) : (
    Promise<InsertManyResult>
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
            lastAutoIncrementId : undefined,
            /**
             * Should this be considered a warning?
             * Probably not.
             */
            warningCount : tm.BigInt(0),
            message : "No rows to insert",
        };
    }

    return connection.lock(async (connection) : Promise<InsertManyResult> => {
        const insertRows = rows.map(
            row => InsertUtil.cleanInsertRow(table, row)
        ) as [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]];
        const insertResult = await connection.insertMany(
            table,
            insertRows
        );

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            const tableAutoIncrement = table.autoIncrement;
            const augmentedInsertRows : [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]] = (
                tableAutoIncrement == undefined ?
                insertRows :
                insertRows.map((insertRow, index) : BuiltInInsertRow<TableT> => {
                    if (index == insertRows.length-1) {
                        return {
                            ...insertRow,
                            /**
                             * The column may be specified to be `string|number|bigint`.
                             * So, we need to use the column's mapper,
                             * to get the desired data type.
                             */
                            [tableAutoIncrement] : table.columns[tableAutoIncrement].mapper(
                                `${table.alias}.${table.autoIncrement}`,
                                /**
                                 * This **should** be `bigint`
                                 */
                                insertResult.lastAutoIncrementId
                            ),
                        };
                    } else {
                        return insertRow;
                    }
                })
            );

            await fullConnection.eventEmitters.onInsert.invoke(new InsertEvent({
                connection : fullConnection,
                table,
                insertRows : augmentedInsertRows,
                insertResult,
            }));
        }

        return insertResult;
    });
}
