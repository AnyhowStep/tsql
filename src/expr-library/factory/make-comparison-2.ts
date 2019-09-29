import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {NonNullComparableType, ComparableTypeUtil} from "../../comparable-type";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Comparison2Return<
    LeftT extends RawExpr<NonNullComparableType>,
    RightT extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
> =
    ExprUtil.Intersect<
        boolean,
        LeftT|RightT
    >
;
export type Comparison2 =
    <
        LeftT extends RawExpr<NonNullComparableType>,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends RawExpr<RawExprUtil.TypeOf<LeftT>>
        RightT extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT,
        right : RightT
    ) => (
        Comparison2Return<LeftT, RightT>
    )
;

/**
 * Factory for making comparison operators.
 *
 * These do not allow `null` to be used in comparisons.
 */
export function makeComparison2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    typeHint? : TypeHint
) : Comparison2 {
    const result : Comparison2 = <
        LeftT extends RawExpr<NonNullComparableType>,
        RightT extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<LeftT>>>
    >(left : LeftT, right : RightT) : (
        Comparison2Return<LeftT, RightT>
    ) => {
        RawExprUtil.assertNonNull("LHS", left);
        RawExprUtil.assertNonNull("RHS", left);
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
        ) as Comparison2Return<LeftT, RightT>;
    };
    return result;
}
