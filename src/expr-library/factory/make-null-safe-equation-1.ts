import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../built-in-expr";
import {BuiltInExprUtil} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {EquatableType} from "../../equatable-type";

export type NullSafeEquation1 =
    <
        BuiltInExprT extends BuiltInExpr<EquatableType>
    >(
        builtInExpr : BuiltInExprT
    ) => (
        ExprUtil.Intersect<boolean, BuiltInExprT>
    )
;

/**
 * Factory for making null-safe unary equation operators.
 */
export function makeNullSafeEquation1<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeEquation1 {
    const result : NullSafeEquation1 = <
        BuiltInExprT extends BuiltInExpr<EquatableType>
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
                    BuiltInExprUtil.buildAst(builtInExpr),
                ],
                typeHint
            )
        );
    };
    return result;
}
