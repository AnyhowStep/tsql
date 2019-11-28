import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../select-clause";
import {AnyBuiltInExpr} from "../../../raw-expr";
import {SelectValueDelegate} from "../../select-value-delegate";
import {Select, select} from "./select";
import {ValueFromRawExpr, valueFromRawExpr} from "../constructor";
import {AssertValidUsedRef, AssertValidColumnIdentifier} from "../predicate";
import {AssertNonUnion} from "../../../type-util";

export type SelectValue<
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> =
    Select<
        SelectClauseT,
        ValueFromRawExpr<BuiltInExprT>
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
        ValueFromRawExpr<BuiltInExprT>
    >(
        fromClause,
        selectClause,
        columns => (
            valueFromRawExpr<BuiltInExprT>(selectValueDelegate(columns)) as (
                & ValueFromRawExpr<BuiltInExprT>
                & AssertNonUnion<ValueFromRawExpr<BuiltInExprT>>
                & AssertValidUsedRef<FromClauseT, ValueFromRawExpr<BuiltInExprT>>
                & AssertValidColumnIdentifier<SelectClauseT, ValueFromRawExpr<BuiltInExprT>>
            )
        )
    );
}
