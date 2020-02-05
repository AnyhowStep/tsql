import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type AnyOperator1<
    OutputTypeT
> =
    <
        ArgT extends AnyBuiltInExpr
    > (
        arg : ArgT
    ) => (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    )
;
export function makeAnyOperator1<
    OperatorTypeT extends OperatorType,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    AnyOperator1<OutputTypeT>
) {
    const result : AnyOperator1<OutputTypeT> = <
        ArgT extends AnyBuiltInExpr
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
                    BuiltInExprUtil.buildAst(arg),
                ],
                typeHint
            )
        );
    };

    return result;
}
