import * as tm from "type-mapping";
import {InsertableTable, TableUtil, DeletableTable, TableWithAutoIncrement} from "../../../table";
import {ReplaceOneResult, ReplaceOneConnection, IConnection} from "../../connection";
import {CustomInsertRow, InsertUtil, BuiltInInsertRow} from "../../../insert";
import {DataTypeUtil} from "../../../data-type";
import {ReplaceEvent, ReplaceOneEvent} from "../../../event";

export type ReplaceOneResultWithAutoIncrement<
    AutoIncrementColumnAlias extends string
> =
    & ReplaceOneResult
    & { autoIncrementId : bigint }
    & { [columnAlias in AutoIncrementColumnAlias] : bigint }
;
export type ReplaceOneWithAutoIncrementReturnType<
    TableT extends TableWithAutoIncrement
> =
    ReplaceOneResultWithAutoIncrement<TableT["autoIncrement"]>
;

export async function replaceOneImplNoEvent<
    TableT extends InsertableTable & DeletableTable
> (
    table : TableT,
    connection : ReplaceOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<{
        insertRow : BuiltInInsertRow<TableT>,
        replaceResult : (
            TableT extends TableWithAutoIncrement ?
            ReplaceOneWithAutoIncrementReturnType<TableT> :
            ReplaceOneResult
        ),
    }>
) {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertDeleteEnabled(table);

    /**
     * Should contain only `BuiltInExpr` now
     */
    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return {
            insertRow : row,
            replaceResult : await connection.replaceOne(table, row) as (
                TableT extends TableWithAutoIncrement ?
                ReplaceOneWithAutoIncrementReturnType<TableT> :
                ReplaceOneResult
            ),
        };
    }

    let explicitAutoIncrementBuiltInExpr = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementBuiltInExpr === undefined) {
        const replaceResult = await connection.replaceOne(table, row);

        if (replaceResult.autoIncrementId != undefined) {
            return {
                insertRow : row,
                replaceResult : {
                    ...replaceResult,
                    [table.autoIncrement] : replaceResult.autoIncrementId,
                } as (
                    TableT extends TableWithAutoIncrement ?
                    ReplaceOneWithAutoIncrementReturnType<TableT> :
                    ReplaceOneResult
                ),
            };
        }

        /**
         * @todo Custom error type
         */
        throw new Error(`Successful replaceOne() to ${table.alias} should return autoIncrementId`);
    }

    explicitAutoIncrementBuiltInExpr = await DataTypeUtil.evaluateCustomExpr(
        table.columns[table.autoIncrement],
        connection,
        explicitAutoIncrementBuiltInExpr
    );

    const autoIncrementBigInt = tm.BigInt(explicitAutoIncrementBuiltInExpr as any);

    const replaceResult = await connection.replaceOne(
        table,
        {
            ...row,
            [table.autoIncrement] : explicitAutoIncrementBuiltInExpr,
        }
    );

    /**
     * We defer to the `autoIncrementId` of the `replaceResult`.
     * We assume the `connection` always knows best.
     */
    if (replaceResult.autoIncrementId != undefined) {
        return {
            insertRow : row,
            replaceResult : {
                ...replaceResult,
                [table.autoIncrement] : replaceResult.autoIncrementId,
            } as (
                TableT extends TableWithAutoIncrement ?
                ReplaceOneWithAutoIncrementReturnType<TableT> :
                ReplaceOneResult
            ),
        };
    }

    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        insertRow : row,
        replaceResult : {
            ...replaceResult,
            autoIncrementId : autoIncrementBigInt,
            [table.autoIncrement] : autoIncrementBigInt,
        } as (
            TableT extends TableWithAutoIncrement ?
            ReplaceOneWithAutoIncrementReturnType<TableT> :
            ReplaceOneResult
        ),
    };
}

export function createReplaceOneEvents<
    TableT extends InsertableTable & DeletableTable
> (
    table : TableT,
    fullConnection : IConnection,
    insertRow : BuiltInInsertRow<TableT>,
    replaceResult : ReplaceOneResult,
) : (
    {
        replaceEvent : ReplaceEvent<TableT>,
        replaceOneEvent : ReplaceOneEvent<TableT>,
    }
) {
    const augmentedInsertRow = (
        table.autoIncrement == undefined ?
        insertRow :
        {
            ...insertRow,
            /**
             * The column may be specified to be `string|number|bigint`.
             * So, we need to use the column's mapper,
             * to get the desired data type.
             */
            [table.autoIncrement] : table.columns[table.autoIncrement].mapper(
                `${table.alias}.${table.autoIncrement}`,
                /**
                 * This **should** be `bigint`
                 */
                replaceResult.autoIncrementId
            ),
        }
    );

    const replaceEvent = new ReplaceEvent({
        connection : fullConnection,
        table,
        insertRows : [augmentedInsertRow],
        replaceResult,
    });
    const replaceOneEvent = new ReplaceOneEvent({
        connection : fullConnection,
        table,
        insertRow : augmentedInsertRow,
        replaceResult,
    });

    return {
        replaceEvent,
        replaceOneEvent,
    };
}

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
    Promise<
        TableT extends TableWithAutoIncrement ?
        ReplaceOneWithAutoIncrementReturnType<TableT> :
        ReplaceOneResult
    >
) {
    return connection.lock(async (connection) : (
        Promise<
            TableT extends TableWithAutoIncrement ?
            ReplaceOneWithAutoIncrementReturnType<TableT> :
            ReplaceOneResult
        >
    ) => {
        const {
            insertRow,
            replaceResult,
        } = await replaceOneImplNoEvent<TableT>(
            table,
            connection,
            row
        );

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            const {
                replaceEvent,
                replaceOneEvent,
            } = createReplaceOneEvents(
                table,
                fullConnection,
                insertRow,
                replaceResult,
            );
            await fullConnection.eventEmitters.onReplace.invoke(replaceEvent);
            await fullConnection.eventEmitters.onReplaceOne.invoke(replaceOneEvent);
        }

        return replaceResult;
    });
}
