import * as tm from "type-mapping";
import {BuiltInExpr_NonAggregate, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type AggregateOperator3<
    LeftTypeT,
    MidTypeT,
    RightTypeT,
    OutputTypeT
> =
    <
        LeftT extends BuiltInExpr_NonAggregate<LeftTypeT>,
        MidT extends BuiltInExpr_NonAggregate<MidTypeT>,
        RightT extends BuiltInExpr_NonAggregate<RightTypeT>
    > (
        left : LeftT,
        mid : MidT,
        right : RightT
    ) => (
        ExprUtil.AggregateIntersect<OutputTypeT, LeftT|MidT|RightT>
    )
;

export function makeAggregateOperator3<
    OperatorTypeT extends OperatorType,
    LeftTypeT=never,
    MidTypeT=never,
    RightTypeT=never,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand3<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    AggregateOperator3<LeftTypeT, MidTypeT, RightTypeT, OutputTypeT>
) {
    const result : AggregateOperator3<LeftTypeT, MidTypeT, RightTypeT, OutputTypeT> = <
        LeftT extends BuiltInExpr_NonAggregate<LeftTypeT>,
        MidT extends BuiltInExpr_NonAggregate<MidTypeT>,
        RightT extends BuiltInExpr_NonAggregate<RightTypeT>
    > (
        left : LeftT,
        mid : MidT,
        right : RightT
    ) : (
        ExprUtil.AggregateIntersect<OutputTypeT, LeftT|MidT|RightT>
    ) => {
        return ExprUtil.aggregateIntersect<OutputTypeT, LeftT|MidT|RightT>(
            mapper,
            [left, mid, right],
            OperatorNodeUtil.operatorNode3<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(left),
                    BuiltInExprUtil.buildAst(mid),
                    BuiltInExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };

    return result;
}
