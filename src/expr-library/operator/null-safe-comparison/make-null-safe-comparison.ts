import * as tm from "type-mapping";
import {Expr, expr} from "../../../expr";
import {RawExpr} from "../../../raw-expr";
import {PrimitiveExpr} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";

export type NullSafeComparison = (
    <
        LeftT extends RawExpr<PrimitiveExpr>,
        RightT extends RawExpr<RawExprUtil.TypeOf<LeftT>|null>
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
 * Factory for making null-safe comparison operators.
 */
export function makeNullSafeComparison (operator : string) : NullSafeComparison {
    const result : NullSafeComparison = (left, right) => {
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
