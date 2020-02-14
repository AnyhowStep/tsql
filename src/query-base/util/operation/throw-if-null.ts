import {AnySubqueryExpr} from "../../../built-in-expr";
import * as ExprLib from "../../../expr-library";

export type ThrowIfNull<
    QueryT extends AnySubqueryExpr
> =
    ExprLib.ThrowIfNullExpr<QueryT>
;
export function throwIfNull<
    QueryT extends AnySubqueryExpr
> (
    query : QueryT
) : (
    ThrowIfNull<QueryT>
) {
    return ExprLib.throwIfNull<QueryT>(
        query
    ) as ThrowIfNull<QueryT>;
}
