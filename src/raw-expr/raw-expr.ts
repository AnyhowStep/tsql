import * as tm from "type-mapping";
import {PrimitiveExpr} from "../primitive-expr";
import {IAnonymousExpr, IExpr} from "../expr";
import {IAnonymousColumn, IColumn, ColumnUtil} from "../column";
import {IAnonymousExprSelectItem, IExprSelectItem} from "../expr-select-item";
import {QueryBaseUtil} from "../query-base";
import {IUsedRef, UsedRefUtil} from "../used-ref";
import {ColumnMap} from "../column-map";

export type RawExpr<TypeT> = (
    | (
        TypeT extends PrimitiveExpr ?
        TypeT :
        never
    )
    | IAnonymousExpr<TypeT>
    | IAnonymousColumn<TypeT>
    | (
        null extends TypeT ?
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.ZeroOrOneRow) :
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.OneRow)
    )
    | IAnonymousExprSelectItem<TypeT>
);

export type AnySubqueryExpr = (QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.ZeroOrOneRow);
export type AnyRawExpr = (
    | PrimitiveExpr
    | IExpr
    | IColumn
    | AnySubqueryExpr
    | IExprSelectItem
);

export type NonPrimitiveRawExprNoUsedRef<TypeT> =
    | IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef<{}>,
    }>
    /**
     * A `column` is itself a used ref, and is not allowed
     */
    //| IAnonymousColumn<TypeT>
    | (
        null extends TypeT ?
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.ZeroOrOneRow & QueryBaseUtil.NonCorrelated) :
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.OneRow & QueryBaseUtil.NonCorrelated)
    )
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,

        tableAlias : string,
        alias : string,

        usedRef : IUsedRef<{}>,
    }>
;
export type AnyRawExprNoUsedRef =
    | PrimitiveExpr
    | NonPrimitiveRawExprNoUsedRef<any>
;

export type RawExprNoUsedRef<TypeT> =
    | (
        TypeT extends PrimitiveExpr ?
        TypeT :
        never
    )
    | NonPrimitiveRawExprNoUsedRef<TypeT>
;

/**
 * We don't support subqueries because it's too complicated
 * to check their `IUsedRef`
 */
export type RawExprUsingColumnMap<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | Extract<TypeT, PrimitiveExpr>
    | IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
    }>
    | ColumnUtil.FromColumnMap<ColumnMapT>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
        tableAlias : string,
        alias : string,
    }>
;
