import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {AssertNonUnion, Identity} from "../type-util";
import {SelectClause} from "./select-clause";
import * as SelectClauseUtil from "./util";
import {GroupByClause} from "../group-by-clause";
import {IExprSelectItem} from "../expr-select-item";

export type SelectDelegateColumns<
    FromClauseT extends IFromClause
> =
    ColumnRefUtil.TryFlatten<
        SelectClauseUtil.AllowedColumnRef<FromClauseT>
    >
;
export type SelectDelegateReturnType<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    Identity<
        & SelectsT
        /**
         * Hack to force TS to infer a non-empty tuple type, rather than array type.
         *
         * ```ts
         *  declare function foo<T extends any[]> (t : T) : T;
         *  declare function foo2<T extends any[]> (t : T & { "0":unknown }) : T;
         *  //const x: number[]
         *  const x = foo([1,2,3]);
         *  //const x2: [number, number, number]
         *  const x2 = foo2([1,2,3]);
         * ```
         */
        & { "0" : unknown }
        & AssertNonUnion<SelectsT>
        & SelectClauseUtil.AssertValidColumnIdentifier<SelectClauseT, SelectsT>
        & (
            GroupByClauseT extends GroupByClause ?
            (
                & SelectClauseUtil.AssertValidUsedRef_Aggregate<FromClauseT, SelectsT>
                & SelectClauseUtil.AssertValidUsedRef_NonAggregate<FromClauseT, GroupByClauseT, SelectsT>
            ) :
            (
                true extends Extract<
                    | SelectsT[number]
                    | Extract<SelectClauseT, SelectClause>[number],
                    IExprSelectItem
                >["isAggregate"] ?
                (
                    & SelectClauseUtil.AssertValidUsedRef_Aggregate<FromClauseT, SelectsT>
                    & SelectClauseUtil.AssertValidUsedRef_NonAggregate<FromClauseT, [], SelectsT>
                ) :
                SelectClauseUtil.AssertValidUsedRef<FromClauseT, SelectsT>
            )
        )
    >
;
export type SelectDelegate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    (
        columns : SelectDelegateColumns<FromClauseT>
    ) => SelectDelegateReturnType<FromClauseT, GroupByClauseT, SelectClauseT, SelectsT>
;
