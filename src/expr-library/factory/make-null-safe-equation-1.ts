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
        RawExprT extends RawExpr<EquatableType>
    >(
        rawExpr : RawExprT
    ) => (
        ExprUtil.Intersect<boolean, RawExprT>
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
        RawExprT extends RawExpr<EquatableType>
    >(
        rawExpr : RawExprT
    ) : (
        ExprUtil.Intersect<boolean, RawExprT>
    ) => {
        return ExprUtil.intersect(
            tm.mysql.boolean(),
            [rawExpr],
            OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(rawExpr),
                ],
                typeHint
            )
        );
    };
    return result;
}
