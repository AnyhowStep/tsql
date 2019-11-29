import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {BuiltInExprUtil, CustomExpr_NonCorrelated, AnyBuiltInExpr} from "../../../built-in-expr";
import {IAnonymousColumn} from "../../../column";
import {DataTypeUtil} from "../../../data-type";
import {IUsedRef} from "../../../used-ref";

export type FromBuiltInExpr<BuiltInExprT extends AnyBuiltInExpr> = (
    Expr<{
        mapper : BuiltInExprUtil.Mapper<BuiltInExprT>,
        usedRef : BuiltInExprUtil.UsedRef<BuiltInExprT>,
    }>
);
export function fromBuiltInExpr<
    BuiltInExprT extends AnyBuiltInExpr
> (
    builtInExpr : BuiltInExprT
) : (
    FromBuiltInExpr<BuiltInExprT>
) {
    if (builtInExpr instanceof ExprImpl) {
        return builtInExpr;
    }
    const mapper = BuiltInExprUtil.mapper(builtInExpr);
    const usedRef = BuiltInExprUtil.usedRef(builtInExpr);
    const ast = BuiltInExprUtil.buildAst(builtInExpr);
    return expr(
        {
            mapper,
            usedRef,
        },
        ast
    );
}

export function fromRawExprNoUsedRefInput<
    TypeT
> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : CustomExpr_NonCorrelated<TypeT>
) : (
    Expr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef<{}>,
    }>
) {
    if (BuiltInExprUtil.isAnyNonValueExpr(value)) {
        /**
         * Cannot map a `NonValueExpr`
         */
        return fromBuiltInExpr(value as any);
    } else {
        return fromBuiltInExpr(
            DataTypeUtil.toBuiltInExpr_NonCorrelated(
                mapper,
                value
            ) as any
        );
    }
}
