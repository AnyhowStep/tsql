import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableWithoutAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {InsertOneConnection, InsertOneResult} from "../../connection";
import {InsertRow_Input, InsertUtil} from "../../../insert";
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
    row : InsertRow_Input<TableT>
) : (
    Promise<InsertOneWithAutoIncrementReturnType<TableT>>
);
export async function insertOne<
    TableT extends TableWithoutAutoIncrement & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : InsertRow_Input<TableT>
) : (
    Promise<InsertOneResult>
);
export async function insertOne<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : InsertRow_Input<TableT>
) : (
    Promise<InsertOneResult>
) {
    TableUtil.assertInsertEnabled(table);

    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return connection.insertOne(table, row);
    }

    let explicitAutoIncrementValue = (row as { [k:string]:unknown })[table.autoIncrement];

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

    explicitAutoIncrementValue = await DataTypeUtil.evaluateExpr(
        table.columns[table.autoIncrement],
        connection,
        explicitAutoIncrementValue
    );

    const insertResult = await connection.insertOne(
        table,
        {
            ...row,
            [table.autoIncrement] : explicitAutoIncrementValue,
        }
    );

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
        autoIncrementId : BigInt(explicitAutoIncrementValue as any),
        [table.autoIncrement] : BigInt(explicitAutoIncrementValue as any),
    };
}
