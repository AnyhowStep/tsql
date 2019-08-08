import * as tm from "type-mapping";
import {Expr} from "../../../expr";
import {RawExpr} from "../../../raw-expr";
import {PrimitiveExpr} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";

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
/*
    Factory for making null-safe unary comparison operators.
*/
export function makeNullSafeUnaryComparison (postFixOperatorAst : string) : NullSafeUnaryComparison {
    const result : NullSafeUnaryComparison = (rawExpr) => {
        return new Expr(
            {
                mapper : tm.mysql.boolean(),
                usedRef : RawExprUtil.usedRef(rawExpr),
            },
            [
                RawExprUtil.buildAst(rawExpr),
                postFixOperatorAst
            ]
        );
    };
    return result;
}
