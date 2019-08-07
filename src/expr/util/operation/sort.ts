import {IExpr} from "../../expr";
import {SortDirection} from "../../../sort-direction";

export type Asc<ExprT extends IExpr> = (
    [ExprT, SortDirection.ASC]
);
export function asc<
    ExprT extends IExpr
> (expr : ExprT) : Asc<ExprT> {
    return [expr, SortDirection.ASC];
}

export type Desc<ExprT extends IExpr> = (
    [ExprT, typeof SortDirection.DESC]
);
export function desc<
    ExprT extends IExpr
> (expr : ExprT) : Desc<ExprT> {
    return [expr, SortDirection.DESC];
}

export type Sort<ExprT extends IExpr> = (
    [ExprT, SortDirection]
);
export function sort<
    ExprT extends IExpr
> (expr : ExprT, sortDirection : SortDirection) : Sort<ExprT> {
    return [expr, sortDirection];
}
