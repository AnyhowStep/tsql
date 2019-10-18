import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {AssertNonUnion, Identity} from "../type-util";
import {SelectClause} from "./select-clause";
import * as SelectClauseUtil from "./util";

export type SelectDelegateColumns<
    FromClauseT extends IFromClause
> =
    ColumnRefUtil.TryFlatten<
        SelectClauseUtil.AllowedColumnRef<FromClauseT>
    >
;
export type SelectDelegateReturnType<
    FromClauseT extends IFromClause,
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
        & SelectClauseUtil.AssertValidUsedRef<FromClauseT, SelectsT>
        & SelectClauseUtil.AssertValidColumnIdentifier<SelectClauseT, SelectsT>
    >
;
export type SelectDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    (
        columns : SelectDelegateColumns<FromClauseT>
    ) => SelectDelegateReturnType<FromClauseT, SelectClauseT, SelectsT>
;
