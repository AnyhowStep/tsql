import * as tm from "type-mapping";
import {AnyBuiltInExpr_NonAggregate, BuiltInExprUtil} from "../../../built-in-expr";
import {Expr, expr} from "../../expr-impl";
import {TryReuseExistingType} from "../../../type-util";
import {Ast} from "../../../ast";

/**
 * Given `foo(arg0, arg1, ...)`,
 *
 * | `foo` is aggregate | some `arg` is aggregate | expression is aggregate |
 * |--------------------|-------------------------|-------------------------|
 * | Y                  | Y                       | -Compile Error-
 * | Y                  | N                       | Y
 * | N                  | Y                       | Y
 * | N                  | N                       | N
 *
 * This `AggregateIntersect<>` type assumes `foo` is aggregate.
 * @see Intersect<>
 */
export type AggregateIntersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr_NonAggregate
> =
    TryReuseExistingType<
        ArgsT,
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : BuiltInExprUtil.IntersectUsedRef<
                ArgsT
            >,
            isAggregate : true,
        }>
    >
;
/**
 * Called wasteful because it does not attempt to reuse existing types,
 * wasting our depth limit.
 */
export type __WastefulAggregateIntersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr_NonAggregate
> =
    Expr<{
        mapper : tm.SafeMapper<OutputTypeT>,
        usedRef : BuiltInExprUtil.IntersectUsedRef<
            ArgsT
        >,
        isAggregate : true,
    }>
;
export function aggregateIntersect<
    OutputTypeT,
    ArgsT extends AnyBuiltInExpr_NonAggregate
> (
    mapper : tm.SafeMapper<OutputTypeT>,
    args : readonly ArgsT[],
    ast : Ast
) : AggregateIntersect<OutputTypeT, ArgsT> {
    /**
     * @todo Set the `name` parameter?
     */
    BuiltInExprUtil.assertAllNonAggregate(``, args);

    return expr(
        {
            mapper,
            usedRef : BuiltInExprUtil.intersectUsedRef(...args),
            isAggregate : true,
        },
        ast
    ) as AggregateIntersect<OutputTypeT, ArgsT>;
}
