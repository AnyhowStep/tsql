import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../../table";
import {EqCandidateKeyOfTableDelegate} from "./eq-candidate-keys-of-table-delegate";
import {Expr} from "../../../../expr/expr-impl";
import {UsedRefUtil} from "../../../../used-ref";

/**
 * @param src - A table that does not need keys
 * @param dst - The table with at least one candidate key to compare against
 * @param eqCandidateKeyofTableDelegate - A function that returns columns from `src` matching columns of
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
