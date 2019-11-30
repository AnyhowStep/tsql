import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../select-clause";
import {AnyBuiltInExpr} from "../../../built-in-expr";
import {SelectValueDelegate} from "../../select-value-delegate";
import {Select, select} from "./select";
import {ValueFromBuiltInExpr, valueFromBuiltInExpr} from "../constructor";
import {AssertValidUsedRef, AssertValidColumnIdentifier} from "../predicate";
import {AssertNonUnion} from "../../../type-util";

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
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> (
    fromClause : FromClauseT,
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
        SelectClauseT,
        ValueFromBuiltInExpr<BuiltInExprT>
    >(
        fromClause,
        selectClause,
        columns => (
            valueFromBuiltInExpr<BuiltInExprT>(selectValueDelegate(columns)) as (
                & ValueFromBuiltInExpr<BuiltInExprT>
                & AssertNonUnion<ValueFromBuiltInExpr<BuiltInExprT>>
                & AssertValidUsedRef<FromClauseT, ValueFromBuiltInExpr<BuiltInExprT>>
                & AssertValidColumnIdentifier<SelectClauseT, ValueFromBuiltInExpr<BuiltInExprT>>
            )
        )
    );
}
