import * as tm from "type-mapping";
import {BuiltInExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {AssertNonNever} from "../../type-util";

export type Operator2<
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> =
    <
        LeftT extends BuiltInExpr<LeftTypeT>,
        RightT extends BuiltInExpr<RightTypeT>
    > (
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.Intersect<OutputTypeT, LeftT|RightT>
    )
;
export function makeOperator2<
    OperatorTypeT extends OperatorType,
    InputTypeT=never,
    OutputTypeT=never
> (
    operatorType : (
        & OperatorTypeT
        & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>
        & AssertNonNever<[InputTypeT], "InputTypeT required">
    ),
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2<InputTypeT, InputTypeT, OutputTypeT>
);
export function makeOperator2<
    OperatorTypeT extends OperatorType,
    LeftTypeT=never,
    RightTypeT=never,
    OutputTypeT=never
> (
    operatorType : (
        & OperatorTypeT
        & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>
        & AssertNonNever<[LeftTypeT], "LeftTypeT required">
        & AssertNonNever<[RightTypeT], "RightTypeT required">
    ),
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2<LeftTypeT, RightTypeT, OutputTypeT>
);
export function makeOperator2<
    OperatorTypeT extends OperatorType,
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2<any, any, OutputTypeT>
) {
    const result : Operator2<LeftTypeT, RightTypeT, OutputTypeT> = <
        LeftT extends BuiltInExpr<LeftTypeT>,
        RightT extends BuiltInExpr<RightTypeT>
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
