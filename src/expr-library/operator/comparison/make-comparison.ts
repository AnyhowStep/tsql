import * as tm from "type-mapping";
import {Expr, expr} from "../../../expr";
import {RawExpr} from "../../../raw-expr";
import {NonNullPrimitiveExpr} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";

export type Comparison = (
    <
        LeftT extends RawExpr<NonNullPrimitiveExpr>,
        RightT extends RawExpr<RawExprUtil.TypeOf<LeftT>>
    >(
        left : LeftT,
        right : RightT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : RawExprUtil.IntersectUsedRef<
                | LeftT
                | RightT
            >,
        }>
    )
);
/**
 * Factory for making comparison operators.
 */
export function makeComparison (operator : string) : Comparison {
    const result : Comparison = (left, right) => {
        return expr(
            {
                mapper : tm.mysql.boolean(),
                usedRef : RawExprUtil.intersectUsedRef(
                    left,
                    right
                ),
            },
            [
                RawExprUtil.buildAst(left),
                operator,
                RawExprUtil.buildAst(right),
            ]
        );
    };
    return result;
}
