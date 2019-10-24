import * as tm from "type-mapping";
import {PrimitiveExpr} from "../primitive-expr";
import {IAnonymousExpr, IExpr} from "../expr";
import {IAnonymousColumn, IColumn} from "../column";
import {IAnonymousExprSelectItem, IExprSelectItem} from "../expr-select-item";
import {QueryBaseUtil} from "../query-base";
import {IUsedRef} from "../used-ref";

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

export type RawExprNoUsedRef<TypeT> = (
    | (
        TypeT extends PrimitiveExpr ?
        TypeT :
        never
    )
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
);
