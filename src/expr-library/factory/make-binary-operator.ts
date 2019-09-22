import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

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
        ExprUtil.Intersect<OutputTypeT, LeftT|RightT>
    )
;
export type BinaryOperator2<
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> =
    <
        LeftT extends RawExpr<LeftTypeT>,
        RightT extends RawExpr<RightTypeT>
    > (
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.Intersect<OutputTypeT, LeftT|RightT>
    )
;
export function makeBinaryOperator<
    OperatorTypeT extends OperatorType,
    InputTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    BinaryOperator<InputTypeT, OutputTypeT>
);
export function makeBinaryOperator<
    OperatorTypeT extends OperatorType,
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    BinaryOperator2<LeftTypeT, RightTypeT, OutputTypeT>
);
export function makeBinaryOperator<
    OperatorTypeT extends OperatorType,
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    | BinaryOperator<any, OutputTypeT>
    | BinaryOperator2<any, any, OutputTypeT>
) {
    const result : BinaryOperator2<LeftTypeT, RightTypeT, OutputTypeT> = <
        LeftT extends RawExpr<LeftTypeT>,
        RightT extends RawExpr<RightTypeT>
    > (
        left : LeftT,
        right : RightT
    ) : (
        ExprUtil.Intersect<OutputTypeT, LeftT|RightT>
    ) => {
        return ExprUtil.intersect<OutputTypeT, LeftT|RightT>(
            mapper,
            [left, right],
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };

    return result;
}
