import * as tm from "type-mapping";
import {AnyRawExpr, RawExprUtil} from "../../../raw-expr";
import {Expr, expr} from "../../expr-impl";
import {TryReuseExistingType} from "../../../type-util";
import {IExpr} from "../../expr";
import {IExprSelectItem} from "../../../expr-select-item";
import {Ast} from "../../../ast";

export type Intersect<
    OutputTypeT,
    ArgsT extends AnyRawExpr
> =
    TryReuseExistingType<
        ArgsT,
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : TryReuseExistingType<
                Extract<ArgsT, IExpr|IExprSelectItem>["usedRef"],
                RawExprUtil.IntersectUsedRef<
                    ArgsT
                >
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
    ArgsT extends AnyRawExpr
> =
    Expr<{
        mapper : tm.SafeMapper<OutputTypeT>,
        usedRef : RawExprUtil.IntersectUsedRef<
            ArgsT
        >,
    }>
;
export function intersect<
    OutputTypeT,
    ArgsT extends AnyRawExpr
> (
    mapper : tm.SafeMapper<OutputTypeT>,
    args : ArgsT[],
    ast : Ast
) : Intersect<OutputTypeT, ArgsT> {
    return expr(
        {
            mapper,
            usedRef : RawExprUtil.intersectUsedRef(...args),
        },
        ast
    ) as Intersect<OutputTypeT, ArgsT>;
}
