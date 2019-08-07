import {PrimitiveExpr} from "../primitive-expr";
import {IAnonymousExpr, IExpr} from "../expr";
import {IAnonymousColumn, IColumn} from "../column";
import {IAnonymousExprSelectItem, IExprSelectItem} from "../expr-select-item";
import {QueryUtil} from "../query";

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
        (QueryUtil.OneSelectItem<TypeT> & QueryUtil.ZeroOrOneRow) :
        (QueryUtil.OneSelectItem<TypeT> & QueryUtil.OneRow)
    )
    | IAnonymousExprSelectItem<TypeT>
);

export type AnyRawExpr = (
    | PrimitiveExpr
    | IExpr
    | IColumn
    | (QueryUtil.OneSelectItem<any> & QueryUtil.ZeroOrOneRow)
    | IExprSelectItem
);
