import {SelectClauseUtil, SelectDelegateColumns, SelectValueDelegateReturnType, SelectDelegateReturnType} from "../../../select-clause";
import {BeforeCompoundQueryClause} from "../helper-type";
import {AnyBuiltInExpr} from "../../../raw-expr";
import {select, Select} from "./select";
import {Correlate} from "./correlate";

export type SelectValue<
    QueryT extends BeforeCompoundQueryClause,
    BuiltInExprT extends AnyBuiltInExpr
> = (
    Select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
    >
);

export type QuerySelectValueDelegate<
    QueryT extends BeforeCompoundQueryClause,
    BuiltInExprT extends AnyBuiltInExpr
> =
    (
        columns : SelectDelegateColumns<QueryT["fromClause"]>,
        subquery : Correlate<QueryT>
    ) => SelectValueDelegateReturnType<QueryT["fromClause"], QueryT["selectClause"], BuiltInExprT>
;

export function selectValue<
    QueryT extends BeforeCompoundQueryClause,
    BuiltInExprT extends AnyBuiltInExpr
> (
    query : QueryT,
    selectValueDelegate : QuerySelectValueDelegate<QueryT, BuiltInExprT>
) : (
    SelectValue<QueryT, BuiltInExprT>
) {
    return select<
        QueryT,
        SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
    >(
        query,
        (columns, subquery) => (
            SelectClauseUtil.valueFromRawExpr<BuiltInExprT>(selectValueDelegate(columns, subquery)) as (
                SelectDelegateReturnType<
                    QueryT["fromClause"],
                    QueryT["selectClause"],
                    SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
                >
            )
        )
    );
}
