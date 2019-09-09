import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export type BinaryOperator<
    InputTypeT,
    OutputTypeT
> =
    <
        LeftT extends RawExpr<InputTypeT>,
        RightT extends RawExpr<InputTypeT>
    > (
        left : LeftT,
        right : RightT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<
                | LeftT
                | RightT
            >,
        }>
    )
;
export function makeBinaryOperator<
    OperatorTypeT extends OperatorType,
    InputTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>
) {
    const result : BinaryOperator<InputTypeT, OutputTypeT> = <
        LeftT extends RawExpr<InputTypeT>,
        RightT extends RawExpr<InputTypeT>
    > (
        left : LeftT,
        right : RightT
    ) : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<
                | LeftT
                | RightT
            >,
        }>
    ) => {
        return expr(
            {
                mapper,
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
