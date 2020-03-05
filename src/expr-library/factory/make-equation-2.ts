import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr, AnyBuiltInExpr} from "../../built-in-expr";
import {BuiltInExprUtil} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {BaseType} from "../../type-util";

export type Equation2Return<
    LeftT extends AnyBuiltInExpr,
    RightT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<LeftT>>>
> =
    ExprUtil.Intersect<
        boolean,
        LeftT|RightT
    >
;
export type Equation2 =
    <
        LeftT extends AnyBuiltInExpr,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends BuiltInExpr<BuiltInExprUtil.TypeOf<LeftT>>
        RightT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT & BuiltInExprUtil.AssertNonNull<LeftT>,
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
    const result = <
        LeftT extends AnyBuiltInExpr,
        RightT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<LeftT>>>
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
    return result as Equation2;
}
