import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr} from "../../raw-expr";
import {NonNullComparableType, ComparableTypeUtil} from "../../comparable-type";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Comparison3Return<
    LeftT extends BuiltInExpr<NonNullComparableType>,
    MidT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>,
    RightT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
> =
    ExprUtil.Intersect<
        boolean,
        LeftT|MidT|RightT
    >
;
export type Comparison3 =
    <
        LeftT extends BuiltInExpr<NonNullComparableType>,
        MidT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends BuiltInExpr<RawExprUtil.TypeOf<LeftT>>
        RightT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT,
        mid : MidT,
        right : RightT
    ) => (
        Comparison3Return<LeftT, MidT, RightT>
    )
;

/**
 * Factory for making ternary comparison operators.
 *
 * These do not allow `null` to be used in comparisons.
 */
export function makeComparison3<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand3<OperatorTypeT>,
    typeHint? : TypeHint
) : Comparison3 {
    const result : Comparison3 = <
        LeftT extends BuiltInExpr<NonNullComparableType>,
        MidT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>,
        RightT extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
    >(left : LeftT, mid : MidT, right : RightT) : (
        ExprUtil.Intersect<
            boolean,
            LeftT|MidT|RightT
        >
    ) => {
        RawExprUtil.assertNonNull("LHS", left);
        RawExprUtil.assertNonNull("MHS", mid);
        RawExprUtil.assertNonNull("RHS", left);
        return ExprUtil.intersect<boolean, LeftT|MidT|RightT>(
            tm.mysql.boolean(),
            [left, mid, right],
            OperatorNodeUtil.operatorNode3<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(mid),
                    RawExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };
    return result;
}
