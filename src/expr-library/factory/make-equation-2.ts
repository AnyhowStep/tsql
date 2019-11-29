import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../built-in-expr";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {BuiltInExprUtil} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Equation2Return<
    LeftT extends BuiltInExpr<NonNullEquatableType>,
    RightT extends BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<LeftT>>>
> =
    ExprUtil.Intersect<
        boolean,
        LeftT|RightT
    >
;
export type Equation2 =
    <
        LeftT extends BuiltInExpr<NonNullEquatableType>,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends BuiltInExpr<BuiltInExprUtil.TypeOf<LeftT>>
        RightT extends BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT,
        right : RightT
    ) => (
        Equation2Return<LeftT, RightT>
    )
;

/**
 * Factory for making comparison operators.
 *
 * These do not allow `null` to be used in comparisons.
 */
export function makeEquation2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    typeHint? : TypeHint
) : Equation2 {
    const result : Equation2 = <
        LeftT extends BuiltInExpr<NonNullEquatableType>,
        RightT extends BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<LeftT>>>
    >(left : LeftT, right : RightT) : (
        Equation2Return<LeftT, RightT>
    ) => {
        BuiltInExprUtil.assertNonNull("LHS", left);
        BuiltInExprUtil.assertNonNull("RHS", left);
        return ExprUtil.intersect<boolean, LeftT|RightT>(
            tm.mysql.boolean(),
            [left, right],
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(left),
                    BuiltInExprUtil.buildAst(right),
                ],
                typeHint
            )
        ) as Equation2Return<LeftT, RightT>;
    };
    return result;
}
