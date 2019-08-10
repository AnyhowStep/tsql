import {Expr, ExprImpl, expr} from "../../expr-impl";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {PrimitiveExpr} from "../../../primitive-expr";

export type FromRawExpr<RawExprT extends RawExpr<PrimitiveExpr>> = (
    Expr<{
        mapper : RawExprUtil.Mapper<RawExprT>,
        usedRef : RawExprUtil.UsedRef<RawExprT>,
    }>
);
export function fromRawExpr<
    RawExprT extends RawExpr<PrimitiveExpr>
> (
    rawExpr : RawExprT
) : (
    FromRawExpr<RawExprT>
) {
    if (rawExpr instanceof ExprImpl) {
        return rawExpr;
    }
    const mapper = RawExprUtil.mapper(rawExpr);
    const usedRef = RawExprUtil.usedRef(rawExpr);
    const ast = RawExprUtil.buildAst(rawExpr);
    return expr(
        {
            mapper,
            usedRef,
        },
        ast
    );
}
