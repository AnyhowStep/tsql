import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {EquatableType} from "../../equatable-type";

export type NullSafeEquation1 =
    <
        BuiltInExprT extends RawExpr<EquatableType>
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
        BuiltInExprT extends RawExpr<EquatableType>
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
