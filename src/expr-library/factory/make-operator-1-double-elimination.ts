import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {Operator1} from "./make-operator-1";
import {tryExtractAstOr} from "../../ast/util";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Makes a double elimination unary operator.
 *
 * A double elimination function `f` has the following property,
 * `f(f(x)) == x`
 */
export function makeOperator1DoubleElimination<
    OperatorTypeT extends OperatorType,
    InputTypeT=never,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator1<InputTypeT, OutputTypeT>
) {
    const result : Operator1<InputTypeT, OutputTypeT> = <
        ArgT extends BuiltInExpr<InputTypeT>
    > (
        arg : ArgT
    ) : (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    ) => {
        return ExprUtil.intersect<OutputTypeT, ArgT>(
            mapper,
            [arg],
            tryExtractAstOr(
                BuiltInExprUtil.buildAst(arg),
                operand => (
                    OperatorNodeUtil.isOperatorNode(operand) && operand.operatorType == operatorType ?
                    operand.operands[0] :
                    undefined
                ),
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
