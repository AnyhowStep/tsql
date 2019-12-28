import {ITable, TableWithAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IsolableInsertOneConnection, InsertOneResult} from "../../connection";
import {CustomInsertRow, CustomInsertRowWithCandidateKey, BuiltInInsertRow} from "../../../insert";
import {Row} from "../../../row";
import {InsertOneWithAutoIncrementReturnType, insertOneImplNoEvent, createInsertOneEvents} from "./insert-one";
import * as ExprLib from "../../../expr-library";
import {DataTypeUtil} from "../../../data-type";
import {TryEvaluateColumnsResult} from "../../../data-type/util";
import {InsertAndFetchEvent} from "../../../event";

export type InsertAndFetchRow<
    TableT extends InsertableTable
> =
    TableT extends TableWithAutoIncrement ?
    CustomInsertRow<TableT> :
    CustomInsertRowWithCandidateKey<TableT>
;

async function insertAndFetchImpl<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertAndFetchRow<TableT>
) : (
    Promise<{
        insertRow : BuiltInInsertRow<TableT>,
        insertResult : (
            TableT extends TableWithAutoIncrement ?
            InsertOneWithAutoIncrementReturnType<TableT> :
            InsertOneResult
        ),
        fetchedRow : Row<TableT>,
    }>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertHasCandidateKey(table);

    return connection.transactionIfNotInOne(async (connection) : (
        Promise<{
            insertRow : BuiltInInsertRow<TableT>,
            insertResult : (
                TableT extends TableWithAutoIncrement ?
                InsertOneWithAutoIncrementReturnType<TableT> :
                InsertOneResult
            ),
            fetchedRow : Row<TableT>,
        }>
    ) => {
        if (
            table.autoIncrement == undefined
        ) {
            const candidateKeyResult : (
                TryEvaluateColumnsResult<TableT, any>
            ) = await DataTypeUtil.tryEvaluateInsertableCandidateKeyPreferPrimaryKey(
                table,
                connection,
                row as any
            );
            if (!candidateKeyResult.success) {
                throw candidateKeyResult.error;
            }
            row = {
                ...row,
                ...candidateKeyResult.outputRow,
            };
            const insertOneImplResult = await insertOneImplNoEvent(table, connection, row as any);
            const fetchedRow = await TableUtil.fetchOne<TableT>(
                table,
                connection,
                () => ExprLib.eqCandidateKey(
                    table,
                    candidateKeyResult.outputRow as any
                ) as any
            );
            return {
                ...insertOneImplResult,
                fetchedRow,
            };
        } else {
            const insertOneImplResult = await insertOneImplNoEvent(table, connection, row as any);
            const fetchedRow = await TableUtil.fetchOne<TableT>(
                table,
                connection,
                /**
                 * We use this instead of `eqPrimaryKey()` because it's possible
                 * for an `AUTO_INCREMENT` column to not be a primary key
                 * with some databases...
                 *
                 * It's also possible for it to not be a candidate key!
                 */
                () => ExprLib.eqColumns(
                    table,
                    {
                        [table.autoIncrement as string] : insertOneImplResult.insertResult.autoIncrementId,
                    } as any
                ) as any
            );
            return {
                ...insertOneImplResult,
                fetchedRow,
            };
        }
    });
}

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
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : InsertAndFetchRow<TableT>
) : (
    Promise<Row<TableT>>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertHasCandidateKey(table);

    return connection.lock(async (connection) : Promise<Row<TableT>> => {
        const {
            insertRow,
            insertResult,
            fetchedRow,
        } = await insertAndFetchImpl<TableT>(
            table,
            connection,
            row
        );

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            const {
                insertEvent,
                insertOneEvent,
            } = createInsertOneEvents(
                table,
                fullConnection,
                insertRow,
                insertResult,
            );
            await fullConnection.eventEmitters.onInsert.invoke(insertEvent);
            await fullConnection.eventEmitters.onInsertOne.invoke(insertOneEvent);
            await fullConnection.eventEmitters.onInsertAndFetch.invoke(new InsertAndFetchEvent({
                connection : fullConnection,
                table,
                insertRow : insertOneEvent.insertRow,
                insertResult : insertOneEvent.insertResult,
                fetchedRow : fetchedRow as any,
            }));
        }

        return fetchedRow;
    });
}
