import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Expr} from "../../expr";
import {UsedRefUtil} from "../../used-ref";
import {and} from "../logical";
import {CandidateKey_Input, CandidateKeyUtil, CandidateKey_Output} from "../../candidate-key";
import {ColumnMapUtil} from "../../column-map";
import {StrictUnion} from "../../type-util";
import {nullSafeEq} from "./null-safe-eq";
import {DataTypeUtil} from "../../data-type";

/**
 * Convenience function for,
 * ```ts
 *  tsql.and(
 *      tsql.nullSafeEq(candidateKeyColumn0, value0),
 *      tsql.nullSafeEq(candidateKeyColumn1, value1),
 *      tsql.nullSafeEq(candidateKeyColumn2, value2)
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
 * Excess properties are especially dangerous for this function.
 *
 * If your `candidateKeyInput` is actually a super key of two candidate keys,
 * then the candidate key this function compares against is arbitrary.
 *
 * The extra properties will be discarded.
 *
 * If you want to compare against a super key, use `eqSuperKey()` instead.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because the candidate key of a table
 * may have nullable columns.
 *
 * @param table - The table with a candidate key
 * @param candidateKeyInput - The candidate key values to compare against
 *
 * @todo Maybe call it `nullSafeEqCandidateKey()` instead?
 * It doesn't use `eq()` at all. It uses `nullSafeEq()`.
 *
 * @todo Maybe have it use `eq()` for columns we know are non-nullable
 * and use `nullSafeEq()` for columns that are nullable?
 */
export type EqCandidateKey = (
    <
        TableT extends Pick<ITable, "columns"|"candidateKeys"|"primaryKey">
    > (
        table : TableT,
        candidateKeyInput : StrictUnion<CandidateKey_Input<TableT>>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    )
);
export const eqCandidateKey : EqCandidateKey = (
    <
        TableT extends Pick<ITable, "columns"|"candidateKeys"|"primaryKey">
    > (
        table : TableT,
        candidateKeyInput : StrictUnion<CandidateKey_Input<TableT>>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>
    ) => {
        const candidateKey = CandidateKeyUtil.mapperPreferPrimaryKey(table)(
            `${ColumnMapUtil.tableAlias(table.columns)}.candidateKey`,
            candidateKeyInput
        );

        /**
         * We `.sort()` the keys so our resulting SQL is deterministic,
         * regardless of how `candidateKey` was constructed.
         */
        const arr = Object.keys(candidateKey).sort().map((columnAlias) => {
            const expr = nullSafeEq(
                table.columns[columnAlias],
                DataTypeUtil.toRawExpr(
                    table.columns[columnAlias].mapper,
                    candidateKey[columnAlias as keyof CandidateKey_Output<TableT>]
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
