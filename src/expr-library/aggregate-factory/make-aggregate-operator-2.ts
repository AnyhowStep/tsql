import * as tm from "type-mapping";
import {BuiltInExpr_NonAggregate, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {AssertNonNever} from "../../type-util";

export type AggregateOperator2<
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> =
    <
        LeftT extends BuiltInExpr_NonAggregate<LeftTypeT>,
        RightT extends BuiltInExpr_NonAggregate<RightTypeT>
    > (
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.AggregateIntersect<OutputTypeT, LeftT|RightT>
    )
;
export function makeAggregateOperator2<
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
    AggregateOperator2<InputTypeT, InputTypeT, OutputTypeT>
);
export function makeAggregateOperator2<
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
    AggregateOperator2<LeftTypeT, RightTypeT, OutputTypeT>
);
export function makeAggregateOperator2<
    OperatorTypeT extends OperatorType,
    LeftTypeT,
    RightTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    AggregateOperator2<any, any, OutputTypeT>
) {
    const result : AggregateOperator2<LeftTypeT, RightTypeT, OutputTypeT> = <
        LeftT extends BuiltInExpr_NonAggregate<LeftTypeT>,
        RightT extends BuiltInExpr_NonAggregate<RightTypeT>
    > (
        left : LeftT,
        right : RightT
    ) : (
        ExprUtil.AggregateIntersect<OutputTypeT, LeftT|RightT>
    ) => {
        return ExprUtil.aggregateIntersect<OutputTypeT, LeftT|RightT>(
            mapper,
            [left, right],
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(left),
                    BuiltInExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };

    return result;
}
