import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../raw-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {ComparableType} from "../../comparable-type";

export type NullSafeComparison1 =
    <
        BuiltInExprT extends BuiltInExpr<ComparableType>
    >(
        builtInExpr : BuiltInExprT
    ) => (
        ExprUtil.Intersect<boolean, BuiltInExprT>
    )
;

/**
 * Factory for making null-safe unary comparison operators.
 */
export function makeNullSafeComparison1<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeComparison1 {
    const result : NullSafeComparison1 = <
        BuiltInExprT extends BuiltInExpr<ComparableType>
    >(
        builtInExpr : BuiltInExprT
    ) : (
        ExprUtil.Intersect<boolean, BuiltInExprT>
    ) => {
        return ExprUtil.intersect(
            tm.mysql.boolean(),
            [builtInExpr],
            OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(builtInExpr),
                ],
                typeHint
            )
        );
    };
    return result;
}
