import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {IgnoredInsertOneResult, InsertIgnoreOneResult, InsertIgnoreOneConnection} from "../../connection";
import {InsertRow, InsertRowPrimitiveAutoIncrement, InsertUtil} from "../../../insert";
import {InsertOneResultWithAutoIncrement} from "./insert-one";

export type IgnoredInsertOneResultWithAutoIncrement<
    TableT extends TableWithAutoIncrement
> =
    & IgnoredInsertOneResult
    & { [columnAlias in TableT["autoIncrement"]] : undefined }
;

export type InsertIgnoreOneResultWithAutoIncrement<
    TableT extends TableWithAutoIncrement
> =
    | IgnoredInsertOneResultWithAutoIncrement<TableT>
    | InsertOneResultWithAutoIncrement<TableT>
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
    connection : InsertIgnoreOneConnection,
    table : TableT,
    row : InsertRowPrimitiveAutoIncrement<TableT>
) : (
    Promise<InsertIgnoreOneResultWithAutoIncrement<TableT>>
);
export async function insertIgnoreOne<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    connection : InsertIgnoreOneConnection,
    table : TableT,
    row : InsertRow<TableT>
) : (
    Promise<InsertIgnoreOneResult>
);
export async function insertIgnoreOne<
    TableT extends ITable & InsertableTable
> (
    connection : InsertIgnoreOneConnection,
    table : TableT,
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
