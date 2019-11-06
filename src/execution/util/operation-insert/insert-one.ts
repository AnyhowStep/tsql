import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {InsertOneConnection, InsertOneResult} from "../../connection";
import {InsertRow, InsertRowPrimitiveAutoIncrement, InsertUtil} from "../../../insert";

export type InsertOneResultWithAutoIncrement<
    TableT extends TableWithAutoIncrement
> =
    & InsertOneResult
    & { autoIncrementId : bigint }
    & { [columnAlias in TableT["autoIncrement"]] : bigint }
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
    row : InsertRowPrimitiveAutoIncrement<TableT>
) : (
    Promise<InsertOneResultWithAutoIncrement<TableT>>
);
export async function insertOne<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<InsertOneResult>
);
export async function insertOne<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : InsertRow<TableT>
) : (
    Promise<InsertOneResult>
) {
    TableUtil.assertInsertEnabled(table);

    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return connection.insertOne(table, row);
    }

    const explicitAutoIncrementValue = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementValue === undefined) {
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

    const insertResult = await connection.insertOne(table, row);

    if (insertResult.autoIncrementId != undefined) {
        return {
            ...insertResult,
            [table.autoIncrement] : insertResult.autoIncrementId,
        };
    }

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        ...insertResult,
        autoIncrementId : BigInt(explicitAutoIncrementValue),
        [table.autoIncrement] : BigInt(explicitAutoIncrementValue),
    };
}
