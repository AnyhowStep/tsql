import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {SuperKey, superKeyMapper, findTableWithColumnAlias} from "../query";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import * as ExprLib from "../../../expr-library";
import {BuiltInExprUtil} from "../../../built-in-expr";

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
 * @param tpt - The `ITablePerType` with a candidate key
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
        TptT extends ITablePerType
    > (
        tpt : TptT,
        superKeyInput : SuperKey<TptT>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >,
            isAggregate : false,
        }>
    )
;
export const eqSuperKey : EqSuperKey = (
    <
        TptT extends ITablePerType
    > (
        tpt : TptT,
        superKeyInput : SuperKey<TptT>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >,
            isAggregate : false,
        }>
    ) => {
        const superKey = superKeyMapper(tpt)(
            `${tpt.childTable}.superKey`,
            superKeyInput
        );

        const arr = Object.keys(superKey)
            .filter((columnAlias) => {
                return superKey[columnAlias] !== undefined;
            })
            /**
             * We `.sort()` the keys so our resulting SQL is deterministic,
             * regardless of how `superKey` was constructed.
             */
            .sort()
            .map((columnAlias) => {
                const table = findTableWithColumnAlias(tpt, columnAlias);
                const expr = ExprLib.nullSafeEq(
                    table.columns[columnAlias],
                    BuiltInExprUtil.fromValueExpr<unknown>(
                        table.columns[columnAlias],
                        superKey[columnAlias]
                    )
                );
                return expr as Expr<{
                    mapper : tm.SafeMapper<boolean>,
                    usedRef : UsedRefUtil.FromColumnMap<
                        | TptT["childTable"]["columns"]
                        | TptT["parentTables"][number]["columns"]
                    >,
                    isAggregate : false,
                }>;
            });
        const result = ExprLib.and(...arr);
        return result as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >,
            isAggregate : false,
        }>;
    }
);
