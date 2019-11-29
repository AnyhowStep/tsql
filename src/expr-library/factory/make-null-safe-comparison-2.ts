import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../raw-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {ComparableType} from "../../comparable-type";

export type NullSafeComparison2 =
    <
        LeftT extends BuiltInExpr<ComparableType>,
        RightT extends BuiltInExpr<RawExprUtil.TypeOf<LeftT>|null>
    >(
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.Intersect<boolean, LeftT|RightT>
    )
;
/**
 * Factory for making null-safe comparison operators.
 *
 * These allow `null` in comparisons.
 */
export function makeNullSafeComparison<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeComparison2 {
    const result : NullSafeComparison2 = <
        LeftT extends BuiltInExpr<ComparableType>,
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
