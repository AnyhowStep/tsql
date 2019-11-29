import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../raw-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {EquatableType} from "../../equatable-type";

export type NullSafeEquation2 =
    <
        LeftT extends BuiltInExpr<EquatableType>,
        RightT extends BuiltInExpr<RawExprUtil.TypeOf<LeftT>|null>
    >(
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.Intersect<boolean, LeftT|RightT>
    )
;
/**
 * Factory for making null-safe equation operators.
 *
 * These allow `null` in equations.
 */
export function makeNullSafeEquation2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeEquation2 {
    const result : NullSafeEquation2 = <
        LeftT extends BuiltInExpr<EquatableType>,
        RightT extends BuiltInExpr<RawExprUtil.TypeOf<LeftT>|null>
    >(
        left : LeftT,
        right : RightT
    ) : (
        ExprUtil.Intersect<boolean, LeftT|RightT>
    ) => {
        return ExprUtil.intersect<boolean, LeftT|RightT>(
            tm.mysql.boolean(),
            [left, right],
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };
    return result;
}
