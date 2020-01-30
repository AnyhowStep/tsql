import * as tm from "type-mapping";
import {BuiltInExprUtil, BuiltInExpr_NonAggregate} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type AggregateOperator1<
    InputTypeT,
    OutputTypeT
> =
    <
        ArgT extends BuiltInExpr_NonAggregate<InputTypeT>
    > (
        arg : ArgT
    ) => (
        ExprUtil.AggregateIntersect<OutputTypeT, ArgT>
    )
;
export function makeAggregateOperator1<
    OperatorTypeT extends OperatorType,
    InputTypeT=never,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    AggregateOperator1<InputTypeT, OutputTypeT>
) {
    const result : AggregateOperator1<InputTypeT, OutputTypeT> = <
        ArgT extends BuiltInExpr_NonAggregate<InputTypeT>
    > (
        arg : ArgT
    ) : (
        ExprUtil.AggregateIntersect<OutputTypeT, ArgT>
    ) => {
        return ExprUtil.aggregateIntersect<OutputTypeT, ArgT>(
            mapper,
            [arg],
            OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(arg),
                ],
                typeHint
            )
        );
    };

    return result;
}
