import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, InsertableTable, TableUtil} from "../../../table";
import {InsertOneConnection, InsertOneResult} from "../../connection";
import {CustomInsertRow, InsertUtil, BuiltInInsertRow} from "../../../insert";
import {DataTypeUtil} from "../../../data-type";
import {InsertOneEvent} from "../../../event";

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
 * Does not invoke events.
 */
async function insertOneImpl<
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<{
        insertRow : BuiltInInsertRow<TableT>,
        insertResult : (
            TableT extends TableWithAutoIncrement ?
            InsertOneWithAutoIncrementReturnType<TableT> :
            InsertOneResult
        ),
    }>
) {
    TableUtil.assertInsertEnabled(table);

    /**
     * Should contain only `BuiltInExpr` now
     */
    row = InsertUtil.cleanInsertRow(table, row);

    if (table.autoIncrement == undefined) {
        return {
            insertRow : row,
            insertResult : await connection.insertOne(table, row) as (
                TableT extends TableWithAutoIncrement ?
                InsertOneWithAutoIncrementReturnType<TableT> :
                InsertOneResult
            ),
        };
    }

    let explicitAutoIncrementBuiltInExpr = (row as { [k:string]:unknown })[table.autoIncrement];

    if (explicitAutoIncrementBuiltInExpr === undefined) {
        const insertResult = await connection.insertOne(table, row);

        if (insertResult.autoIncrementId != undefined) {
            return {
                insertRow : row,
                insertResult : {
                    ...insertResult,
                    [table.autoIncrement] : insertResult.autoIncrementId,
                } as (
                    TableT extends TableWithAutoIncrement ?
                    InsertOneWithAutoIncrementReturnType<TableT> :
                    InsertOneResult
                ),
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
            insertRow : row,
            insertResult : {
                ...insertResult,
                [table.autoIncrement] : insertResult.autoIncrementId,
            } as (
                TableT extends TableWithAutoIncrement ?
                InsertOneWithAutoIncrementReturnType<TableT> :
                InsertOneResult
            ),
        };
    }

    /**
     * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
     * Use it.
     */
    return {
        insertRow : row,
        insertResult : {
            ...insertResult,
            autoIncrementId : autoIncrementBigInt,
            [table.autoIncrement] : autoIncrementBigInt,
        } as (
            TableT extends TableWithAutoIncrement ?
            InsertOneWithAutoIncrementReturnType<TableT> :
            InsertOneResult
        ),
    };
}

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
    TableT extends ITable & InsertableTable
> (
    table : TableT,
    connection : InsertOneConnection,
    row : CustomInsertRow<TableT>
) : (
    Promise<
        TableT extends TableWithAutoIncrement ?
        InsertOneWithAutoIncrementReturnType<TableT> :
        InsertOneResult
    >
) {
    const {
        insertRow,
        insertResult,
    } = await insertOneImpl<TableT>(
        table,
        connection,
        row
    );

    const fullConnection = connection.tryGetFullConnection();
    if (fullConnection != undefined) {
        await fullConnection.eventEmitters.onInsertOne.invoke(new InsertOneEvent({
            connection : fullConnection,
            table,
            insertRow : (
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
                        insertResult.autoIncrementId
                    ),
                }
            ),
            insertResult,
        }));
    }

    return insertResult;
}
