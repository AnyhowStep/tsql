import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {RawExprUtil, RawExprNoUsedRef_Input, AnyBuiltInExpr} from "../../../raw-expr";
import {IAnonymousColumn} from "../../../column";
import {DataTypeUtil} from "../../../data-type";
import {IUsedRef} from "../../../used-ref";

export type FromRawExpr<RawExprT extends AnyBuiltInExpr> = (
    Expr<{
        mapper : RawExprUtil.Mapper<RawExprT>,
        usedRef : RawExprUtil.UsedRef<RawExprT>,
    }>
);
export function fromRawExpr<
    RawExprT extends AnyBuiltInExpr
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

export function fromRawExprNoUsedRefInput<
    TypeT
> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : RawExprNoUsedRef_Input<TypeT>
) : (
    Expr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef<{}>,
    }>
) {
    if (RawExprUtil.isAnyNonValueExpr(value)) {
        /**
         * Cannot map a `NonValueExpr`
         */
        return fromRawExpr(value as any);
    } else {
        return fromRawExpr(
            DataTypeUtil.toRawExpr(
                mapper,
                value
            ) as any
        );
    }
}
