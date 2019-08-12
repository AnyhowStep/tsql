import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {and} from "../logical";
import {CandidateKey_Input, CandidateKeyUtil, CandidateKey_Output} from "../../../candidate-key";
import {NullSafeComparison} from "./make-null-safe-comparison";
import {ColumnMapUtil} from "../../../column-map";
import {StrictUnion} from "../../../type-util";

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
 * Uses `nullSafeEq()` internally because the candidate key of a table
 * may have nullable columns.
 *
 * @param table - The table with a candidate key
 * @param candidateKey - The candidate key values to compare against
 *
 * @todo Maybe call it `nullSafeEqCandidateKey()` instead?
 * It doesn't use `eq()` at all. It uses `nullSafeEq()`.
 *
 * @todo Maybe have it use `eq()` for columns we know are non-nullable
 * and use `nullSafeEq()` for columns that are nullable?
 */
export type EqCandidateKey = (
    <
        TableT extends Pick<ITable, "columns"|"candidateKeys">
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
export function makeEqCandidateKey (
    nullSafeEq : NullSafeComparison
) : (
    EqCandidateKey
) {
    const result : EqCandidateKey = (
        <
            TableT extends Pick<ITable, "columns"|"candidateKeys">
        > (
            table : TableT,
            candidateKeyInput : StrictUnion<CandidateKey_Input<TableT>>
        ) : (
            Expr<{
                mapper : tm.SafeMapper<boolean>,
                usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
            }>
        ) => {
            const candidateKey = CandidateKeyUtil.mapper(table)(
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
                    candidateKey[columnAlias as keyof CandidateKey_Output<TableT>]
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
    return result;
}
