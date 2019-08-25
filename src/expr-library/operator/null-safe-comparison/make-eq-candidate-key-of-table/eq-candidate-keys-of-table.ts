import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../../table";
import {EqCandidateKeyOfTableDelegate} from "./eq-candidate-keys-of-table-delegate";
import {Expr} from "../../../../expr/expr-impl";
import {UsedRefUtil} from "../../../../used-ref";

/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.and(
 *          tsql.nullSafeEq(src.dstCk0, dst.dstCk0),
 *          tsql.nullSafeEq(src.dstCk1, dst.dstCk1),
 *          tsql.nullSafeEq(src.dstCk2, dst.dstCk2),
 *          //etc.
 *      ));
 * ```
 * -----
 *
 * + The `src` does not need to have keys.
 * + The `dst` must have at least one candidate key.
 * + The `src` must have columns **null-safe** comparable to columns of `dst`'s candidate key.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because `src.dstCkX` and `dst.dstCkX` may have nullable columns.
 *
 * @param src - A table that does not need keys
 * @param dst - The table with at least one candidate key to compare against
 * @param eqCandidateKeyofTableDelegate - A function that returns columns from `src` matching columns of `dst`
 */
export type EqCandidateKeyOfTable =
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<ITable, "columns"|"candidateKeys">,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        src : SrcT,
        dst : DstT,
        eqCandidateKeyofTableDelegate : EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    )
;
