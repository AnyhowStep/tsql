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
    RawExprT extends AnyBuiltInExpr
> =
    Select<
        SelectClauseT,
        ValueFromRawExpr<RawExprT>
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
    RawExprT extends AnyBuiltInExpr
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    selectValueDelegate : SelectValueDelegate<FromClauseT, SelectClauseT, RawExprT>
) : (
    SelectValue<
        SelectClauseT,
        RawExprT
    >
) {
    return select<
        FromClauseT,
        SelectClauseT,
        ValueFromRawExpr<RawExprT>
    >(
        fromClause,
        selectClause,
        columns => (
            valueFromRawExpr<RawExprT>(selectValueDelegate(columns)) as (
                & ValueFromRawExpr<RawExprT>
                & AssertNonUnion<ValueFromRawExpr<RawExprT>>
                & AssertValidUsedRef<FromClauseT, ValueFromRawExpr<RawExprT>>
                & AssertValidColumnIdentifier<SelectClauseT, ValueFromRawExpr<RawExprT>>
            )
        )
    );
}
