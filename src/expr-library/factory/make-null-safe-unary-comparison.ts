import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {PrimitiveExpr} from "../../primitive-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Expr} from "../../expr/expr-impl";

export type NullSafeUnaryComparison = (
    <
        RawExprT extends RawExpr<PrimitiveExpr>
    >(
        rawExpr : RawExprT
    ) => (
        ExprUtil.Intersect<boolean, RawExprT>
    )
);
/**
 * Called wasteful because it does not attempt to reuse existing types,
 * wasting our depth limit.
 */
export type __WastefulNullSafeUnaryComparison = (
    <
        RawExprT extends RawExpr<PrimitiveExpr>
    >(
        rawExpr : RawExprT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : RawExprUtil.UsedRef<RawExprT>,
        }>
    )
);
/**
 * Factory for making null-safe unary comparison operators.
 */
export function makeNullSafeUnaryComparison<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeUnaryComparison {
    const result : NullSafeUnaryComparison = (rawExpr) => {
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
