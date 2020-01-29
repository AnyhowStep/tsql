import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../select-clause";
import {AnyBuiltInExpr} from "../../../built-in-expr";
import {SelectValueDelegate} from "../../select-value-delegate";
import {Select, select} from "./select";
import {ValueFromBuiltInExpr, valueFromBuiltInExpr} from "../constructor";
import {GroupByClause} from "../../../group-by-clause";

export type SelectValue<
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> =
    Select<
        SelectClauseT,
        ValueFromBuiltInExpr<BuiltInExprT>
    >
;
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .select(() => [myExpr.as("value")])
 * ```
 *
 * Intended usage,
 * ```ts
 *  myQuery
 *      .selectValue(() => myExpr)
 * ```
 */
export function selectValue<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    selectClause : SelectClauseT,
    selectValueDelegate : SelectValueDelegate<FromClauseT, SelectClauseT, BuiltInExprT>
) : (
    SelectValue<
        SelectClauseT,
        BuiltInExprT
    >
) {
    return select<
        FromClauseT,
        GroupByClauseT,
        SelectClauseT,
        ValueFromBuiltInExpr<BuiltInExprT>
    >(
        fromClause,
        groupByClause,
        selectClause,
        columns => (
            valueFromBuiltInExpr<BuiltInExprT>(selectValueDelegate(columns)) as any
        )
    );
}
