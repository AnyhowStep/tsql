import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {NonNullPrimitiveExpr, PrimitiveExprUtil} from "../../primitive-expr";
import {RawExprUtil} from "../../raw-expr";
import {TryReuseExistingType} from "../../type-util";
import {IExpr} from "../../expr";
import {IExprSelectItem} from "../../expr-select-item";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export type ComparisonReturn<
    LeftT extends RawExpr<NonNullPrimitiveExpr>,
    RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
> =
    TryReuseExistingType<
        LeftT|RightT,
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : TryReuseExistingType<
                Extract<LeftT|RightT, IExpr|IExprSelectItem>["usedRef"],
                RawExprUtil.IntersectUsedRef<
                    | LeftT
                    | RightT
                >
            >,
        }>
    >
;
export type Comparison =
    <
        LeftT extends RawExpr<NonNullPrimitiveExpr>,
        /**
         * https://github.com/microsoft/TypeScript/issues/33002#issuecomment-523651736
         *
         * @todo Investigate
         */
        //RightT extends RawExpr<RawExprUtil.TypeOf<LeftT>>
        RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
    >(
        left : LeftT,
        right : RightT
    ) => (
        ComparisonReturn<LeftT, RightT>
    )
;

/**
 * Factory for making comparison operators.
 *
 * These do not allow `null` to be used in comparisons.
 */
export function makeComparison<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>
) : Comparison {
    const result : Comparison = <
        LeftT extends RawExpr<NonNullPrimitiveExpr>,
        RightT extends RawExpr<PrimitiveExprUtil.NonNullPrimitiveType<RawExprUtil.TypeOf<LeftT>>>
    >(left : LeftT, right : RightT) : (
        ComparisonReturn<LeftT, RightT>
    ) => {
        RawExprUtil.assertNonNull("LHS", left);
        RawExprUtil.assertNonNull("RHS", left);
        return expr(
            {
                mapper : tm.mysql.boolean(),
                usedRef : RawExprUtil.intersectUsedRef(
                    left,
                    right
                ),
            },
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(right),
                ]
            )
        ) as ComparisonReturn<LeftT, RightT>;
    };
    return result;
}
