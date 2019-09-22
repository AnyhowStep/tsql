import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type UnaryOperator<
    InputTypeT,
    OutputTypeT
> =
    <
        ArgT extends RawExpr<InputTypeT>
    > (
        arg : ArgT
    ) => (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    )
;
export function makeUnaryOperator<
    OperatorTypeT extends OperatorType,
    InputTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) {
    const result : UnaryOperator<InputTypeT, OutputTypeT> = <
        ArgT extends RawExpr<InputTypeT>
    > (
        arg : ArgT
    ) : (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    ) => {
        return ExprUtil.intersect<OutputTypeT, ArgT>(
            mapper,
            [arg],
            OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(arg),
                ],
                typeHint
            )
        );
    };

    return result;
}
