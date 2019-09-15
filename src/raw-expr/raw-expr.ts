import {PrimitiveExpr} from "../primitive-expr";
import {IAnonymousExpr, IExpr} from "../expr";
import {IAnonymousColumn, IColumn} from "../column";
import {IAnonymousExprSelectItem, IExprSelectItem} from "../expr-select-item";
import {QueryBaseUtil} from "../query-base";

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
