import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";
import {OperatorType, OperatorNodeUtil} from "../../ast";
import {UnaryOperator} from "./make-unary-operator";
import {tryExtractAstOr} from "../../ast/util";

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
    mapper : tm.SafeMapper<OutputTypeT>
) {
    const result : UnaryOperator<InputTypeT, OutputTypeT> = <
        ArgT extends RawExpr<InputTypeT>
    > (
        arg : ArgT
    ) : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.UsedRef<ArgT>,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : RawExprUtil.usedRef(arg),
            },
            tryExtractAstOr(
                RawExprUtil.buildAst(arg),
                operand => OperatorNodeUtil.isOperatorNode(operand) && operand.operatorType == operatorType,
                operand => OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                    operatorType,
                    [ operand ]
                )
            )
        );
    };

    return result;
}
