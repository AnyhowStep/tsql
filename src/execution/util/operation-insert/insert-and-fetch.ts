import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IsolableInsertOneConnection} from "../../connection";
import {InsertRow_Input, InsertRowRequireCandidateKey_Input} from "../../../insert";
import {Row} from "../../../row";
import {insertOne} from "./insert-one";
import * as ExprLib from "../../../expr-library";
import {DataTypeUtil} from "../../../data-type";
import {TryEvaluateColumnsResult} from "../../../data-type/util";

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
    row : InsertRow_Input<TableT>
) : (
    Promise<Row<TableT>>
);
export async function insertAndFetch<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertRowRequireCandidateKey_Input<TableT>
) : (
    Promise<Row<TableT>>
);
export async function insertAndFetch<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertRow_Input<TableT>
) : (
    Promise<Row<TableT>>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertHasCandidateKey(table);

    return connection.transactionIfNotInOne(async (connection) : Promise<Row<TableT>> => {
        if (table.autoIncrement == undefined) {
            const candidateKeyR : (
                TryEvaluateColumnsResult<TableT, any>
            ) = await DataTypeUtil.tryEvaluateCandidateKeyPreferPrimaryKey(
                table,
                connection,
                row as any
            );
            if (!candidateKeyR.success) {
                throw candidateKeyR.error;
            }
            row = {
                ...row,
                ...candidateKeyR.outputRow,
            };
            await insertOne(table as TableT & TableWithoutAutoIncrement, connection, row as any);
            return TableUtil.fetchOne(
                table,
                connection,
                () => ExprLib.eqCandidateKey(
                    table,
                    candidateKeyR.outputRow as any
                ) as any
            );
        } else {
            const insertResult = await insertOne(table as TableT & TableWithAutoIncrement, connection, row as any);
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
