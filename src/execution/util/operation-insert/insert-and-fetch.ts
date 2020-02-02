import {ITable, TableWithAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IsolableInsertOneConnection, InsertOneResult} from "../../connection";
import {CustomInsertRow, CustomInsertRowWithCandidateKey, BuiltInInsertRow} from "../../../insert";
import {InsertOneWithAutoIncrementReturnType, insertOneImplNoEvent, createInsertOneEvents} from "./insert-one";
import * as ExprLib from "../../../expr-library";
import {DataTypeUtil} from "../../../data-type";
import {TryEvaluateColumnsResult} from "../../../data-type/util";
import {InsertAndFetchEvent} from "../../../event";
import {IsolationLevel} from "../../../isolation-level";
import {Identity, AssertSubsetOwnEnumerableKeys} from "../../../type-util";
import {CustomExprUtil} from "../../../custom-expr";

export type InsertAndFetchRow<
    TableT extends InsertableTable
> =
    TableT extends TableWithAutoIncrement ?
    CustomInsertRow<TableT> :
    CustomInsertRowWithCandidateKey<TableT>
;

export type InsertedAndFetchedRow<
    TableT extends InsertableTable,
    RowT extends InsertAndFetchRow<TableT>
> =
    Identity<{
        readonly [columnAlias in TableUtil.ColumnAlias<TableT>] : (
            columnAlias extends keyof RowT ?
            (
                undefined extends RowT[columnAlias] ?
                TableUtil.ColumnType<TableT, columnAlias> :
                CustomExprUtil.TypeOf<
                    RowT[columnAlias]
                >
            ) :
            TableUtil.ColumnType<TableT, columnAlias>
        )
    }>
;

async function insertAndFetchImplNoEvent<
    TableT extends ITable & InsertableTable,
    RowT extends InsertAndFetchRow<TableT>
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : RowT & AssertSubsetOwnEnumerableKeys<RowT, InsertAndFetchRow<TableT>>
) : (
    Promise<{
        insertRow : BuiltInInsertRow<TableT>,
        insertResult : (
            TableT extends TableWithAutoIncrement ?
            InsertOneWithAutoIncrementReturnType<TableT> :
            InsertOneResult
        ),
        fetchedRow : InsertedAndFetchedRow<TableT, RowT>,
    }>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertHasCandidateKey(table);

    /**
     * @todo Check if `SERIALIZABLE` is better.
     * Intuitively, `REPEATABLE_READ` makes sense because
     * we're just reading a row we've inserted inside this transaction.
     */
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : (
        Promise<{
            insertRow : BuiltInInsertRow<TableT>,
            insertResult : (
                TableT extends TableWithAutoIncrement ?
                InsertOneWithAutoIncrementReturnType<TableT> :
                InsertOneResult
            ),
            fetchedRow : InsertedAndFetchedRow<TableT, RowT>,
        }>
    ) => {
        return connection.savepoint(async (connection) : (
            Promise<{
                insertRow : BuiltInInsertRow<TableT>,
                insertResult : (
                    TableT extends TableWithAutoIncrement ?
                    InsertOneWithAutoIncrementReturnType<TableT> :
                    InsertOneResult
                ),
                fetchedRow : InsertedAndFetchedRow<TableT, RowT>,
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
                ) as unknown as InsertedAndFetchedRow<TableT, RowT>;
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
                ) as unknown as InsertedAndFetchedRow<TableT, RowT>;
                return {
                    ...insertOneImplResult,
                    fetchedRow,
                };
            }
        });
    });
}

/**
 * Added for `TablePerTypeUtil.insertAndFetch()`,
 * which needs to set `explicitAutoIncrementValueEnabled : true`,
 * to synchronize autoIncrement column values across the table hierarchy.
 */
export interface InsertAndFetchOptions {
    explicitAutoIncrementValueEnabled? : boolean;
}

/**
 * Convenience method for
 * ```ts
 *  connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) => {
 *      await table.insertOne(connection, ...);
 *      return table.fetchOne(connection, ...);
 *  });
 * ```
 */
export async function insertAndFetch<
    TableT extends ITable & InsertableTable,
    RowT extends InsertAndFetchRow<TableT>
> (
    table : TableT,
    connection : IsolableInsertOneConnection,
    row : RowT & AssertSubsetOwnEnumerableKeys<RowT, InsertAndFetchRow<TableT>>,
    insertAndFetchOptions? : InsertAndFetchOptions
) : (
    Promise<InsertedAndFetchedRow<TableT, RowT>>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertHasCandidateKey(table);

    return connection.lock(async (connection) : Promise<InsertedAndFetchedRow<TableT, RowT>> => {
        const {
            insertRow,
            insertResult,
            fetchedRow,
        } = await insertAndFetchImplNoEvent<TableT, RowT>(
            (
                insertAndFetchOptions == undefined ?
                table :
                {
                    ...table,
                    ...insertAndFetchOptions,
                }
            ),
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
