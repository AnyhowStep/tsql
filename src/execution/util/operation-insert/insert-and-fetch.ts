import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IsolableInsertOneConnection} from "../../connection";
import {InsertRow, InsertRowPrimitiveAutoIncrement, InsertRowPrimitiveCandidateKey} from "../../../insert";
import {Row} from "../../../row";
import {insertOne} from "./insert-one";
import * as ExprLib from "../../../expr-library";

/**
 * Convenience method for
 * ```ts
 *  connection.transactionIfNotInOne(async (connection) => {
 *      await table.insertOne(connection, ...);
 *      return table.fetchOne(connection, ...);
 *  });
 * ```
 */
export async function insertAndFetch<
    TableT extends TableWithAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertRowPrimitiveAutoIncrement<TableT>
) : (
    Promise<Row<TableT>>
);
export async function insertAndFetch<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    /**
     * @todo Better type safety here?
     */
    row : InsertRowPrimitiveCandidateKey<TableT>
) : (
    Promise<Row<TableT>>
);
export async function insertAndFetch<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<Row<TableT>>
) {
    TableUtil.assertInsertEnabled(table);

    return connection.transactionIfNotInOne(async (connection) : Promise<Row<TableT>> => {
        if (table.autoIncrement == undefined) {
            await insertOne(table as TableT & TableWithoutAutoIncrement, connection, row);
            return TableUtil.fetchOne(
                table,
                connection,
                /**
                 * @todo Better type safety here?
                 *
                 * If `row` is all `IExpr`, then this will throw a run-time error,
                 * even though it will compile-successfully
                 */
                () => ExprLib.eqCandidateKey(
                    table,
                    row as any
                ) as any
            );
        } else {
            const insertResult = await insertOne(table as TableT & TableWithAutoIncrement, connection, row);
            return TableUtil.fetchOne(
                table,
                connection,
                /**
                 * We use this instead of `eqPrimaryKey()` because it's possible
                 * for an `AUTO_INCREMENT` column to not be a primary key
                 * with some databases...
                 */
                () => ExprLib.eqCandidateKey(
                    table,
                    {
                        ...row,
                        [table.autoIncrement as string] : insertResult.autoIncrementId,
                    } as any
                ) as any
            );
        }
    });
}
