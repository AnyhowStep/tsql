import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {UnaryOperator} from "./make-unary-operator";
import {tryExtractAstOr} from "../../ast/util";
import {OperatorType} from "../../operator-type";

/**
 * Makes a double elimination unary operator.
 *
 * A double elimination function `f` has the following property,
 * `f(f(x)) == x`
 */
export function makeDoubleEliminationUnaryOperator<
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
                operand => (
                    OperatorNodeUtil.isOperatorNode(operand) && operand.operatorType == operatorType ?
                    operand.operands[0] :
                    undefined
                ),
                operand => OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                    operatorType,
                    [ operand ]
                )
            )
        );
    };

    return result;
}
