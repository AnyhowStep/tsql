import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IsolableInsertOneConnection} from "../../connection";
import {InsertRow_Input, InsertUtil, InsertRowRequireCandidateKey_Input} from "../../../insert";
import {Row} from "../../../row";
import {insertOne} from "./insert-one";
import * as ExprLib from "../../../expr-library";
import {CandidateKeyUtil} from "../../../candidate-key";
import {QueryUtil} from "../../../unified-query";
import {ExprUtil} from "../../../expr";
import {ExecutionUtil} from "../..";

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
            const candidateKeyResult = tm.tryMapHandled(
                CandidateKeyUtil.mapperPreferPrimaryKey(table),
                ``,
                row
            );
            if (candidateKeyResult.success) {
                await insertOne(table as TableT & TableWithoutAutoIncrement, connection, row as any);
                return TableUtil.fetchOne(
                    table,
                    connection,
                    () => ExprLib.eqCandidateKey(
                        table,
                        candidateKeyResult.value as any
                    ) as any
                );
            } else {
                //This isn't great.
                //We can't get a candidate key literal from the `row`.
                //We need to make a DB call to evaluate the expressions on `row`.
                row = InsertUtil.cleanInsertRow(table, row);
                /**
                 * This `row` can contain custom data types
                 */
                row = await ExecutionUtil.fetchOne(
                    QueryUtil
                        .newInstance()
                        .select(() => Object.keys(row)
                            .map(columnAlias => {
                                const expr = ExprUtil.fromRawExpr(row[columnAlias as keyof typeof row]);
                                return expr.as(columnAlias);
                            }) as any
                        ) as any,
                    connection
                ) as any;
                /**
                 * We **must** have a candidate key now.
                 */
                const candidateKey = CandidateKeyUtil.mapperPreferPrimaryKey(table)(
                    `${table.alias}.candidateKey`,
                    row
                );
                await insertOne(table as TableT & TableWithoutAutoIncrement, connection, row as any);
                return TableUtil.fetchOne(
                    table,
                    connection,
                    () => ExprLib.eqCandidateKey(
                        table,
                        candidateKey as any
                    ) as any
                );
            }
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
