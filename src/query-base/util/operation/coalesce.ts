import {AnySubqueryExpr, AnyBuiltInExpr} from "../../../built-in-expr";
import * as ExprLib from "../../../expr-library";

export type Coalesce<
    QueryT extends AnySubqueryExpr,
    DefaultValueT extends AnyBuiltInExpr
> =
    ExprLib.CoalesceExpr<[QueryT, DefaultValueT]>
;
export function coalesce<
    QueryT extends AnySubqueryExpr,
    DefaultValueT extends AnyBuiltInExpr
> (
    query : QueryT,
    defaultValue : DefaultValueT
) : (
    Coalesce<QueryT, DefaultValueT>
) {
    return ExprLib.coalesce<[QueryT, DefaultValueT]>(
        query,
        defaultValue
    ) as Coalesce<QueryT, DefaultValueT>;
}
