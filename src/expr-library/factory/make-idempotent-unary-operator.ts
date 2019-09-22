import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {UnaryOperator} from "./make-unary-operator";
import {tryExtractAstOr} from "../../ast/util";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Makes an idempotent unary operator.
 *
 * An idempotent function `f` has the following property,
 * `f(f(x)) == f(x)`
 */
export function makeIdempotentUnaryOperator<
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
        return ExprUtil.intersect(
            mapper,
            [arg],
            tryExtractAstOr(
                RawExprUtil.buildAst(arg),
                operand => OperatorNodeUtil.isOperatorNode(operand) && operand.operatorType == operatorType,
                operand => OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                    operatorType,
                    [ operand ],
                    typeHint
                )
            )
        );
    };

    return result;
}
