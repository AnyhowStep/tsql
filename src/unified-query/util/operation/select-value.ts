import {SelectClauseUtil, SelectValueDelegate} from "../../../select-clause";
import {BeforeCompoundQueryClause} from "../helper-type";
import {AnyRawExpr} from "../../../raw-expr";
import {select, Select} from "./select";
import {AssertNonUnion} from "../../../type-util";

export type SelectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyRawExpr
> = (
    Select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<RawExprT>
    >
);
export function selectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyRawExpr
> (
    query : QueryT,
    selectValueDelegate : SelectValueDelegate<QueryT["fromClause"], QueryT["selectClause"], RawExprT>
) : (
    SelectValue<QueryT, RawExprT>
) {
    return select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<RawExprT>
    >(
        query,
        (columns) => (
            SelectClauseUtil.valueFromRawExpr<RawExprT>(selectValueDelegate(columns)) as (
                & SelectClauseUtil.ValueFromRawExpr<RawExprT>
                & AssertNonUnion<SelectClauseUtil.ValueFromRawExpr<RawExprT>>
                & SelectClauseUtil.AssertValidUsedRef<
                    QueryT["fromClause"],
                    SelectClauseUtil.ValueFromRawExpr<RawExprT>
                >
                & SelectClauseUtil.AssertValidColumnIdentifier<
                    QueryT["selectClause"],
                    SelectClauseUtil.ValueFromRawExpr<RawExprT>
                >
            )
        )
    );
}
