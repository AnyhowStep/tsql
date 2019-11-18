import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Expr} from "../../expr";
import {UsedRefUtil} from "../../used-ref";
import {and} from "../logical";
import {ColumnMapUtil} from "../../column-map";
import {PartialRow_Input, PartialRowUtil, PartialRow_Output} from "../../partial-row";
import {nullSafeEq} from "./null-safe-eq";
import {DataTypeUtil} from "../../data-type";

/**
 * Convenience function for,
 * ```ts
 *  tsql.and(
 *      tsql.nullSafeEq(column0, value0),
 *      tsql.nullSafeEq(column1, value1),
 *      tsql.nullSafeEq(column2, value2),
 *      //etc.
 *  );
 * ```
 *
 * -----
 *
 * It is recommended to **only** use this with **object literals**.
 * Excess property checks are disabled for non-object literals.
 * Even if they were enabled, it is possible to slip in extra properties.
 *
 * Extra properties are ignored during run-time but may indicate lapses in logic.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because a table
 * may have nullable columns.
 *
 * @param table - The table
 * @param columnsInput - The column values to compare against
 *
 * @todo Maybe call it `nullSafeEqColumns()` instead?
 * It doesn't use `eq()` at all. It uses `nullSafeEq()`.
 *
 * @todo Maybe have it use `eq()` for columns we know are non-nullable
 * and use `nullSafeEq()` for columns that are nullable?
 */
export type EqColumns = (
    <
        TableT extends Pick<ITable, "columns">
    > (
        table : TableT,
        columnsInput : PartialRow_Input<TableT>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    )
);
export const eqColumns : EqColumns = (
    <
        TableT extends Pick<ITable, "columns">
    > (
        table : TableT,
        columnsInput : PartialRow_Input<TableT>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    ) => {
        const columns = PartialRowUtil.mapper(table)(
            `${ColumnMapUtil.tableAlias(table.columns)}.columns`,
            columnsInput
        );

        const arr = Object.keys(columns)
            .filter((columnAlias) => {
                return columns[columnAlias as keyof PartialRow_Output<TableT>] !== undefined;
            })
            /**
             * We `.sort()` the keys so our resulting SQL is deterministic,
             * regardless of how `columns` was constructed.
             */
            .sort()
            .map((columnAlias) => {
                const expr = nullSafeEq(
                    table.columns[columnAlias],
                    DataTypeUtil.toRawExpr(
                        table.columns[columnAlias].mapper,
                        columns[columnAlias as keyof PartialRow_Output<TableT>]
                    )
                );
                return expr as Expr<{
                    mapper : tm.SafeMapper<boolean>,
                    usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
                }>;
            });
        const result = and(...arr);
        return result as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>;
    }
);
