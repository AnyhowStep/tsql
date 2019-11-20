import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IgnoredInsertOneResult, InsertIgnoreOneResult, InsertIgnoreOneConnection} from "../../connection";
import {InsertRow, InsertUtil} from "../../../insert";
import {InsertOneResultWithAutoIncrement} from "./insert-one";
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
    TableT extends TableWithAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<InsertIgnoreOneWithAutoIncrementReturnType<TableT>>
);
export async function insertIgnoreOne<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<InsertIgnoreOneResult>
);
export async function insertIgnoreOne<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertIgnoreOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<InsertIgnoreOneResult>
) {
    TableUtil.assertInsertEnabled(table);

    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return connection.insertIgnoreOne(table, row);
    }

    const explicitAutoIncrementValue = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementValue === undefined) {
        const insertIgnoreResult = await connection.insertIgnoreOne(table, row);

        if (isIgnoredResult(insertIgnoreResult)) {
            return {
                ...insertIgnoreResult,
                [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
            };
        }

        if (insertIgnoreResult.autoIncrementId != undefined) {
            return {
                ...insertIgnoreResult,
                [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
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
            ...insertIgnoreResult,
            [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
        };
    }

    if (insertIgnoreResult.autoIncrementId != undefined) {
        return {
            ...insertIgnoreResult,
            [table.autoIncrement] : insertIgnoreResult.autoIncrementId,
        };
    }

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        ...insertIgnoreResult,
        autoIncrementId : BigInt(explicitAutoIncrementValue),
        [table.autoIncrement] : BigInt(explicitAutoIncrementValue),
    };
}
