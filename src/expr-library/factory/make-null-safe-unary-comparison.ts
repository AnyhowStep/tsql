import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {RawExpr} from "../../raw-expr";
import {PrimitiveExpr} from "../../primitive-expr";
import {RawExprUtil} from "../../raw-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type NullSafeUnaryComparison = (
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
        return expr(
            {
                mapper : tm.mysql.boolean(),
                usedRef : RawExprUtil.usedRef(rawExpr),
            },
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
