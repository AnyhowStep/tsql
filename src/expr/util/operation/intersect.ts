import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {Expr, expr} from "../../expr-impl";
import {TryReuseExistingType} from "../../../type-util";
import {Ast} from "../../../ast";

export type Intersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr
> =
    TryReuseExistingType<
        ArgsT,
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : BuiltInExprUtil.IntersectUsedRef<
                ArgsT
            >,
        }>
    >
;
/**
 * Called wasteful because it does not attempt to reuse existing types,
 * wasting our depth limit.
 */
export type __WastefulIntersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr
> =
    Expr<{
        mapper : tm.SafeMapper<OutputTypeT>,
        usedRef : BuiltInExprUtil.IntersectUsedRef<
            ArgsT
        >,
    }>
;
export function intersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr
> (
    mapper : tm.SafeMapper<OutputTypeT>,
    args : readonly ArgsT[],
    ast : Ast
) : Intersect<OutputTypeT, ArgsT> {
    return expr(
        {
            mapper,
            usedRef : BuiltInExprUtil.intersectUsedRef(...args),
        },
        ast
    ) as Intersect<OutputTypeT, ArgsT>;
}
