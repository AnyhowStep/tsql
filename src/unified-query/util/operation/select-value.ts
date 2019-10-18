import {SelectClauseUtil, SelectDelegateColumns, SelectValueDelegateReturnType, SelectDelegateReturnType} from "../../../select-clause";
import {BeforeCompoundQueryClause} from "../helper-type";
import {AnyRawExpr} from "../../../raw-expr";
import {select, Select} from "./select";
import {Correlate} from "./correlate";

export type SelectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyRawExpr
> = (
    Select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<RawExprT>
    >
);

export type QuerySelectValueDelegate<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyRawExpr
> =
    (
        columns : SelectDelegateColumns<QueryT["fromClause"]>,
        subquery : Correlate<QueryT>
    ) => SelectValueDelegateReturnType<QueryT["fromClause"], QueryT["selectClause"], RawExprT>
;

export function selectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyRawExpr
> (
    query : QueryT,
    selectValueDelegate : QuerySelectValueDelegate<QueryT, RawExprT>
) : (
    SelectValue<QueryT, RawExprT>
) {
    return select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<RawExprT>
    >(
        query,
        (columns, subquery) => (
            SelectClauseUtil.valueFromRawExpr<RawExprT>(selectValueDelegate(columns, subquery)) as (
                SelectDelegateReturnType<
                    QueryT["fromClause"],
                    QueryT["selectClause"],
                    SelectClauseUtil.ValueFromRawExpr<RawExprT>
                >
            )
        )
    );
}
