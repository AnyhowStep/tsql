import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {Identity} from "../../../type-util";
import {RawExprNoUsedRef_Input} from "../../../raw-expr";
import {SelectConnection, ExecutionUtil} from "../../../execution";
import {QueryUtil} from "../../../unified-query";
import {ExprUtil} from "../../../expr";
import {ColumnMapUtil} from "../../../column-map";

/**
 * This allows custom data types
 */
export type EvaluateColumnsInputRow<
    TableT extends ITable,
    ColumnAliasT extends string
> =
    Identity<{
        readonly [columnAlias in ColumnAliasT] : (
            RawExprNoUsedRef_Input<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }>
;

export type EvaluateColumnsOutputRow<
    TableT extends ITable,
    ColumnAliasT extends string
> =
    Identity<{
        readonly [columnAlias in ColumnAliasT] : (
            ReturnType<TableT["columns"][columnAlias]["mapper"]>
        )
    }>
;

export type TryEvaluateColumnsResult<
    TableT extends ITable,
    ColumnAliasT extends string
> =
    Identity<
        | {
            outputRow : EvaluateColumnsOutputRow<TableT, ColumnAliasT>,
            success : true,
        }
        | {
            success : false,
            error : Error,
        }
    >
;

export async function tryEvaluateColumns<
    TableT extends ITable,
    ColumnAliasT extends string
> (
    table : TableT,
    connection : SelectConnection,
    name : string,
    columnAliases : readonly ColumnAliasT[],
    row : EvaluateColumnsInputRow<TableT, ColumnAliasT>
) : Promise<TryEvaluateColumnsResult<TableT, ColumnAliasT>> {
    /**
     * We do not want extra properties
     */
    row = tm.TypeUtil.pick(
        row,
        ...(columnAliases as (Extract<keyof typeof row, string>)[])
    ) as any;
    const rowKeys = Object.keys(row);
    if (rowKeys.length < columnAliases.length) {
        const missingColumns = columnAliases
            .filter(columnAlias => !rowKeys.includes(columnAlias));
        return {
            success : false,
            error : new Error(`Input row is missing columns ${missingColumns.join(", ")}`),
        };
    }

    const outputRowMapper = ColumnMapUtil.mapper(
        ColumnMapUtil.pick(table.columns, columnAliases)
    );
    const outputRowResult = tm.tryMapHandled(
        outputRowMapper,
        name,
        row
    );
    if (outputRowResult.success) {
        /**
         * The best case scenario
         */
        return {
            success : true,
            outputRow : outputRowResult.value,
        };
    }

    /**
     * Not so great.
     * We have to make a DB call to evaluate the expression(s)
     */
    const query = QueryUtil
        .newInstance()
        .select(() => columnAliases
            .map(columnAlias => {
                const rawExprInput = row[columnAlias as keyof typeof row];
                return ExprUtil.fromRawExprNoUsedRefInput(
                    table.columns[columnAlias],
                    rawExprInput
                ).as(columnAlias);
            }) as any
        );
    row = await ExecutionUtil.fetchOne(
        query as any,
        connection
    ) as any;
    const outputRowResult2 = tm.tryMapHandled(
        outputRowMapper,
        name,
        row
    );
    if (outputRowResult2.success) {
        return {
            success : true,
            outputRow : outputRowResult2.value,
        };
    } else {
        return {
            success : false,
            error : outputRowResult2.mappingError,
        };
    }
}
