import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IgnoredInsertOneResult, InsertIgnoreOneResult, InsertIgnoreOneConnection, InsertOneResult} from "../../connection";
import {CustomInsertRow, InsertUtil, BuiltInInsertRow} from "../../../insert";
import {InsertOneResultWithAutoIncrement, createInsertOneEvents} from "./insert-one";
import {Identity} from "../../../type-util";

export type IgnoredInsertOneResultWithAutoIncrement<
    AutoIncrementColumnAlias extends string
> =
    Identity<
        & IgnoredInsertOneResult
        & { [columnAlias in AutoIncrementColumnAlias] : undefined }
    >
;

export type InsertIgnoreOneResultWithAutoIncrement<
    AutoIncrementColumnAlias extends string
> =
    | IgnoredInsertOneResultWithAutoIncrement<AutoIncrementColumnAlias>
    | InsertOneResultWithAutoIncrement<AutoIncrementColumnAlias>
;

export type InsertIgnoreOneWithAutoIncrementReturnType<
    TableT extends TableWithAutoIncrement
> =
    InsertIgnoreOneResultWithAutoIncrement<TableT["autoIncrement"]>
;

function isIgnoredResult (result : InsertIgnoreOneResult) : result is IgnoredInsertOneResult {
    return tm.BigIntUtil.equal(result.insertedRowCount, tm.BigInt(0));
}

function isInsertOneResult (result : InsertIgnoreOneResult) : result is InsertOneResult {
    return !isIgnoredResult(result);
}

/**
 * Does not invoke events.
 */
async function insertIgnoreOneImpl<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<{
        insertRow : BuiltInInsertRow<TableT>,
        insertResult : (
            TableT extends TableWithAutoIncrement ?
            InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
            InsertIgnoreOneResult
        )
    }>
) {
    TableUtil.assertInsertEnabled(table);

    /**
     * Should contain only `BuiltInExpr` now
     */
    row = InsertUtil.cleanInsertRow(table, row) as any;

    if (table.autoIncrement == undefined) {
        return {
            insertRow : row,
            insertResult : await connection.insertIgnoreOne(table, row) as (
                TableT extends TableWithAutoIncrement ?
                InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
                InsertIgnoreOneResult
            ),
        };
    }

    const explicitAutoIncrementValue = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementValue === undefined) {
        const insertIgnoreResult = await connection.insertIgnoreOne(table, row);

        if (isIgnoredResult(insertIgnoreResult)) {
            return {
                insertRow : row,
                insertResult : {
                    ...insertIgnoreResult,
                    [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
                } as (
                    TableT extends TableWithAutoIncrement ?
                    InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
                    InsertIgnoreOneResult
                ),
            };
        }

        if (insertIgnoreResult.autoIncrementId != undefined) {
            return {
                insertRow : row,
                insertResult : {
                    ...insertIgnoreResult,
                    [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
                } as (
                    TableT extends TableWithAutoIncrement ?
                    InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
                    InsertIgnoreOneResult
                ),
            };
        }

        /**
         * @todo Custom error type
         */
        throw new Error(`Successful insertIgnoreOne() to ${table.alias} should return autoIncrementId`);
    }

    if (
        typeof explicitAutoIncrementValue != "number" &&
        typeof explicitAutoIncrementValue != "string" &&
        !tm.TypeUtil.isBigInt(explicitAutoIncrementValue)
    ) {
        /**
         * @todo Custom error type
         */
        throw new Error(`Explicit autoIncrement value for ${table.alias} must be bigint|number|string`);
    }

    const insertIgnoreResult = await connection.insertIgnoreOne(table, row);

    if (isIgnoredResult(insertIgnoreResult)) {
        return {
            insertRow : row,
            insertResult : {
                ...insertIgnoreResult,
                [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
            } as (
                TableT extends TableWithAutoIncrement ?
                InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
                InsertIgnoreOneResult
            ),
        };
    }

    if (insertIgnoreResult.autoIncrementId != undefined) {
        return {
            insertRow : row,
            insertResult : {
                ...insertIgnoreResult,
                [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
            } as (
                TableT extends TableWithAutoIncrement ?
                InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
                InsertIgnoreOneResult
            ),
        };
    }

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        insertRow : row,
        insertResult : {
            ...insertIgnoreResult,
            autoIncrementId : BigInt(explicitAutoIncrementValue),
            [table.autoIncrement] : BigInt(explicitAutoIncrementValue),
        } as (
            TableT extends TableWithAutoIncrement ?
            InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
            InsertIgnoreOneResult
        ),
    };
}

/**
 * Only inserts zero or one row
 * ```sql
 *  INSERT IGNORE INTO
 *      myTable (...column_list)
 *  VALUES
 *      (...value_list);
 * ```
 */
export async function insertIgnoreOne<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<
        TableT extends TableWithAutoIncrement ?
        InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
        InsertIgnoreOneResult
    >
) {
    return connection.lock(async (connection) : (
        Promise<
            TableT extends TableWithAutoIncrement ?
            InsertIgnoreOneWithAutoIncrementReturnType<TableT> :
            InsertIgnoreOneResult
        >
    ) => {
        const {
            insertRow,
            insertResult,
        } = await insertIgnoreOneImpl<TableT>(
            table,
            connection,
            row
        );

        if (isInsertOneResult(insertResult)) {
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
            }
        }

        return insertResult;
    });
}
