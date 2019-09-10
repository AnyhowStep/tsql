import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {PrimitiveExpr} from "../../primitive-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

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
 *
 * These allow `null` in comparisons.
 */
export function makeNullSafeComparison<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>
) : NullSafeComparison {
    const result : NullSafeComparison = (left, right) => {
        return expr(
            {
                mapper : tm.mysql.boolean(),
                usedRef : RawExprUtil.intersectUsedRef(
                    left,
                    right
                ),
            },
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(right),
                ]
            )
        );
    };
    return result;
}
