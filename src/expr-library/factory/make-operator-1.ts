import * as tm from "type-mapping";
import {BuiltInExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Operator1<
    InputTypeT,
    OutputTypeT
> =
    <
        ArgT extends BuiltInExpr<InputTypeT>
    > (
        arg : ArgT
    ) => (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    )
;
export function makeOperator1<
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
