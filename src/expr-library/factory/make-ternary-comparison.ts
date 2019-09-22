import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {NonNullPrimitiveExpr, PrimitiveExprUtil} from "../../primitive-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type TernaryComparisonReturn<
    LeftT extends RawExpr<NonNullPrimitiveExpr>,
    MidT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>,
    RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
> =
    ExprUtil.Intersect<
        boolean,
        LeftT|MidT|RightT
    >
;
export type TernaryComparison =
    <
        LeftT extends RawExpr<NonNullPrimitiveExpr>,
        MidT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends RawExpr<RawExprUtil.TypeOf<LeftT>>
        RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT,
        mid : MidT,
        right : RightT
    ) => (
        TernaryComparisonReturn<LeftT, MidT, RightT>
    )
;

/**
 * Factory for making ternary comparison operators.
 *
 * These do not allow `null` to be used in comparisons.
 */
export function makeTernaryComparison<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand3<OperatorTypeT>,
    typeHint? : TypeHint
) : TernaryComparison {
    const result : TernaryComparison = <
        LeftT extends RawExpr<NonNullPrimitiveExpr>,
        MidT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>,
        RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
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
