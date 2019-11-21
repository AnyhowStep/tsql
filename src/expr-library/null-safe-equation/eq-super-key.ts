import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Expr} from "../../expr";
import {UsedRefUtil} from "../../used-ref";
import {and} from "../logical";
import {SuperKey_Input, SuperKeyUtil, SuperKey_Output} from "../../super-key";
import {ColumnMapUtil} from "../../column-map";
import {nullSafeEq} from "./null-safe-eq";
import {DataTypeUtil} from "../../data-type";

/**
 * Convenience function for,
 * ```ts
 *  tsql.and(
 *      tsql.nullSafeEq(candidateKeyColumn0, value0),
 *      tsql.nullSafeEq(candidateKeyColumn1, value1),
 *      tsql.nullSafeEq(candidateKeyColumn2, value2),
 *      tsql.nullSafeEq(nonCandidateKeyColumn0, value3),
 *      tsql.nullSafeEq(nonCandidateKeyColumn1, value4),
 *      tsql.nullSafeEq(nonCandidateKeyColumn2, value5),
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
 * Uses `nullSafeEq()` internally because the super key of a table
 * may have nullable columns.
 *
 * @param table - The table with a candidate key
 * @param superKeyInput - The super key values to compare against
 *
 * @todo Maybe call it `nullSafeEqSuperKey()` instead?
 * It doesn't use `eq()` at all. It uses `nullSafeEq()`.
 *
 * @todo Maybe have it use `eq()` for columns we know are non-nullable
 * and use `nullSafeEq()` for columns that are nullable?
 */
export type EqSuperKey =
    <
        TableT extends Pick<ITable, "columns"|"candidateKeys">
    > (
        table : TableT,
        superKeyInput : SuperKey_Input<TableT>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    )
;
export const eqSuperKey : EqSuperKey = (
    <
        TableT extends Pick<ITable, "columns"|"candidateKeys">
    > (
        table : TableT,
        superKeyInput : SuperKey_Input<TableT>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    ) => {
        const superKey = SuperKeyUtil.mapper(table)(
            `${ColumnMapUtil.tableAlias(table.columns)}.superKey`,
            superKeyInput
        );

        const arr = Object.keys(superKey)
            .filter((columnAlias) => {
                return superKey[columnAlias as keyof SuperKey_Output<TableT>] !== undefined;
            })
            /**
             * We `.sort()` the keys so our resulting SQL is deterministic,
             * regardless of how `superKey` was constructed.
             */
            .sort()
            .map((columnAlias) => {
                const expr = nullSafeEq(
                    table.columns[columnAlias],
                    DataTypeUtil.toRawExpr(
                        table.columns[columnAlias],
                        superKey[columnAlias as keyof SuperKey_Output<TableT>]
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
