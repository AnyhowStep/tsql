import * as tm from "type-mapping";
import {TableWithPrimaryKey} from "../../table";
import {PrimaryKey_Input, PrimaryKeyUtil, PrimaryKey_Output} from "../../primary-key";
import {Expr} from "../../expr";
import {UsedRefUtil} from "../../used-ref";
import {eq} from "./eq";
import {and} from "../logical";
import {ColumnMapUtil} from "../../column-map";
import {BuiltInExprUtil} from "../../built-in-expr";

/**
 * Convenience function for,
 * ```ts
 *  tsql.and(
 *      tsql.eq(primaryKeyColumn0, value0),
 *      tsql.eq(primaryKeyColumn1, value1),
 *      tsql.eq(primaryKeyColumn2, value2)
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
 * Uses `eq()` internally because the primary key of a table
 * cannot have nullable columns.
 *
 * @todo Change this to use `nullSafeEq()` jusssst in case people start using
 * nullable columns in PKs for whatever reason?
 *
 * @param table - The table with a primary key
 * @param primaryKeyInput - The primary key values to compare against
 */
export function eqPrimaryKey<
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
> (
    table : TableT,
    primaryKeyInput : PrimaryKey_Input<TableT>
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>,
        isAggregate : false,
    }>
) {
    const primaryKey = PrimaryKeyUtil.mapper(table)(
        `${ColumnMapUtil.tableAlias(table.columns)}.primaryKey`,
        primaryKeyInput
    );

    /**
     * We `.sort()` the keys so our resulting SQL is deterministic,
     * regardless of how `primaryKey` was constructed.
     */
    const arr = Object.keys(primaryKey).sort().map((columnAlias) => {
        /**
         * We use `eq` because the primary key of a table cannot have
         * nullable columns... Right?
         *
         * @todo Decide if we should use null-safe equality anyway,
         * just to be super safe
         */
        const expr = eq(
            table.columns[columnAlias],
            BuiltInExprUtil.fromValueExpr<unknown>(
                table.columns[columnAlias],
                primaryKey[columnAlias as keyof PrimaryKey_Output<TableT>]
            )
        );
        return expr as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>,
            isAggregate : false,
        }>;
    });
    const result = and(...arr);
    return result as Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>,
        isAggregate : false,
    }>;
}
