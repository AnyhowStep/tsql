import * as tm from "type-mapping";
import {ITable, TableWithAutoIncrement, TableUtil} from "../../../table";
import {InsertOneConnection, InsertResult} from "../../connection";
import {InsertRow} from "../../../insert";
import {isPrimitiveExpr} from "../../../primitive-expr/util";
import {RawExprUtil} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {QueryBaseUtil} from "../../../query-base";

function cleanInsertRowColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : true
) : InsertRow<TableT>[keyof InsertRow<TableT>];
function cleanInsertRowColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : false
) : InsertRow<TableT>[keyof InsertRow<TableT>]|undefined;
function cleanInsertRowColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : boolean
) : InsertRow<TableT>[keyof InsertRow<TableT>]|undefined {
    const value = (
        /**
         * This is just safer
         */
        (
            Object.prototype.hasOwnProperty.call(row, columnAlias) &&
            Object.prototype.propertyIsEnumerable.call(row, columnAlias)
        ) ?
        row[columnAlias] :
        undefined
    );
    if (value === undefined) {
        if (required) {
            /**
             * @todo Custom error type
             */
            throw new Error(`Expected value for ${table.alias}.${columnAlias}; received undefined`);
        } else {
            return undefined;
        }
    }

    if (isPrimitiveExpr(value)) {
        return table.columns[columnAlias].mapper(
            `${table.alias}.${columnAlias}`,
            value
        );
    } else if (RawExprUtil.isAnySubqueryExpr(value)) {
        /**
         * Can't really perform many checks here.
         * We can, however, check for `NULL`s.
         */
        if (
            QueryBaseUtil.isZeroOrOneRow(value) &&
            !tm.canOutputNull(table.columns[columnAlias].mapper)
        ) {
            /**
             * @todo Custom error type
             */
            throw new Error(`Cannot INSERT possibly NULL subquery expression to ${table.alias}.${columnAlias}`);
        }
        return value as any;
    } else {
        /**
         * Could be an `IExpr`, `IExprSelectItem`
         *
         * @todo Should we validate these?
         */
        if (
            !ExprUtil.isExpr(value) &&
            !ExprSelectItemUtil.isExprSelectItem(value)
        ) {
            /**
             * @todo Custom error type
             */
            throw new Error(`Expected for ${table.alias}.${columnAlias} Expr|ExprSelectItem`);
        }
        return value as any;
    }
}

/**
 * Removes excess properties.
 * Removes properties with value `undefined`.
 * Checks required properties are there.
 */
function cleanInsertRow<TableT extends ITable> (table : TableT, row : InsertRow<TableT>) : InsertRow<TableT> {
    const result = {} as InsertRow<TableT>;
    for (const requiredColumnAlias of TableUtil.requiredColumnAlias(table)) {
        result[requiredColumnAlias] = cleanInsertRowColumn(
            table,
            row,
            requiredColumnAlias,
            true
        ) as any;
    }

    for (const optionalColumnAlias of TableUtil.optionalColumnAlias(table)) {
        const value = cleanInsertRowColumn(
            table,
            row,
            optionalColumnAlias,
            false
        );
        if (value === undefined) {
            continue;
        }
        result[optionalColumnAlias] = value as any;
    }

    return result;
}

export type InsertOneResultWithAutoIncrement<
    TableT extends TableWithAutoIncrement
> =
    & InsertResult
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
    TableT extends TableWithAutoIncrement
> (
    connection : InsertOneConnection,
    table : TableT,
    row : InsertRow<TableT>
) : (
    Promise<InsertOneResultWithAutoIncrement<TableT>>
);
export async function insertOne<
    TableT extends ITable
> (
    connection : InsertOneConnection,
    table : TableT,
    row : InsertRow<TableT>
) : (
    Promise<InsertResult>
);
export async function insertOne<
    TableT extends ITable
> (
    connection : InsertOneConnection,
    table : TableT,
    row : InsertRow<TableT>
) : (
    Promise<InsertResult>
) {
    row = cleanInsertRow(table, row);

    const insertResult = await connection.insertOne(table, row);

    if (table.autoIncrement == undefined) {
        return insertResult;
    }

    if (insertResult.autoIncrementId != undefined) {
        return {
            ...insertResult,
            [table.autoIncrement] : insertResult.autoIncrementId,
        };
    }

    const explicitAutoIncrementValue = (row as { [k:string]:unknown })[table.autoIncrement];
    if (
        typeof explicitAutoIncrementValue == "number" ||
        typeof explicitAutoIncrementValue == "string" ||
        tm.TypeUtil.isBigInt(explicitAutoIncrementValue)
    ) {
        const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
        /**
         * User supplied an explicit value for the `AUTO_INCREMENT`/`SERIAL` column, for whatever reason.
         * Use it.
         */
        return {
            ...insertResult,
            [table.autoIncrement] : BigInt(explicitAutoIncrementValue),
        };
    }

    /**
     * @todo Custom error type
     */
    throw new Error(`Successful insertOne() to ${table.alias} should return autoIncrementId`);
}
