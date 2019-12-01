import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {InsertOneConnection, InsertOneResult} from "../../connection";
import {CustomInsertRow, InsertUtil} from "../../../insert";
import {DataTypeUtil} from "../../../data-type";

export type InsertOneResultWithAutoIncrement<
    AutoIncrementColumnAlias extends string
> =
    & InsertOneResult
    & { autoIncrementId : bigint }
    & { [columnAlias in AutoIncrementColumnAlias] : bigint }
;
export type InsertOneWithAutoIncrementReturnType<
    TableT extends TableWithAutoIncrement
> =
    InsertOneResultWithAutoIncrement<TableT["autoIncrement"]>
;

/**
 * Only inserts one row
 * ```sql
 *  INSERT INTO
 *      myTable (...column_list)
 *  VALUES
 *      (...value_list);
 * ```
 */
export async function insertOne<
    TableT extends TableWithAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<InsertOneWithAutoIncrementReturnType<TableT>>
);
export async function insertOne<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<InsertOneResult>
);
export async function insertOne<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<InsertOneResult>
) {
    TableUtil.assertInsertEnabled(table);

    /**
     * Should contain only `BuiltInExpr` now
     */
    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return connection.insertOne(table, row);
    }

    let explicitAutoIncrementBuiltInExpr = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementBuiltInExpr === undefined) {
        const insertResult = await connection.insertOne(table, row);

        if (insertResult.autoIncrementId != undefined) {
            return {
                ...insertResult,
                [table.autoIncrement] : insertResult.autoIncrementId,
            };
        }

        /**
         * @todo Custom error type
         */
        throw new Error(`Successful insertOne() to ${table.alias} should return autoIncrementId`);
    }

    explicitAutoIncrementBuiltInExpr = await DataTypeUtil.evaluateCustomExpr(
        table.columns[table.autoIncrement],
        connection,
        explicitAutoIncrementBuiltInExpr
    );

    const autoIncrementBigInt = tm.BigInt(explicitAutoIncrementBuiltInExpr as any);

    const insertResult = await connection.insertOne(
        table,
        {
            ...row,
            [table.autoIncrement] : explicitAutoIncrementBuiltInExpr,
        }
    );

    /**
     * We defer to the `autoIncrementId` of the `insertResult`.
     * We assume the `connection` always knows best.
     */
    if (insertResult.autoIncrementId != undefined) {
        return {
            ...insertResult,
            [table.autoIncrement] : insertResult.autoIncrementId,
        };
    }

    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        ...insertResult,
        autoIncrementId : autoIncrementBigInt,
        [table.autoIncrement] : autoIncrementBigInt,
    };
}
