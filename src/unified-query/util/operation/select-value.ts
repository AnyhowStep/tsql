import {SelectClauseUtil, SelectDelegateColumns, SelectValueDelegateReturnType, SelectDelegateReturnType} from "../../../select-clause";
import {BeforeCompoundQueryClause} from "../helper-type";
import {AnyBuiltInExpr} from "../../../raw-expr";
import {select, Select} from "./select";
import {Correlate} from "./correlate";

export type SelectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyBuiltInExpr
> = (
    Select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<RawExprT>
    >
);

export type QuerySelectValueDelegate<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyBuiltInExpr
> =
    (
        columns : SelectDelegateColumns<QueryT["fromClause"]>,
        subquery : Correlate<QueryT>
    ) => SelectValueDelegateReturnType<QueryT["fromClause"], QueryT["selectClause"], RawExprT>
;

export function selectValue<
    QueryT extends BeforeCompoundQueryClause,
    RawExprT extends AnyBuiltInExpr
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
