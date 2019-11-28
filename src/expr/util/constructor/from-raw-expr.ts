import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {RawExpr, RawExprUtil, RawExprNoUsedRef_Input} from "../../../raw-expr";
import {BuiltInValueExpr} from "../../../built-in-value-expr";
import {IAnonymousColumn} from "../../../column";
import {DataTypeUtil} from "../../../data-type";
import {IUsedRef} from "../../../used-ref";

export type FromRawExpr<RawExprT extends RawExpr<BuiltInValueExpr>> = (
    Expr<{
        mapper : RawExprUtil.Mapper<RawExprT>,
        usedRef : RawExprUtil.UsedRef<RawExprT>,
    }>
);
export function fromRawExpr<
    RawExprT extends RawExpr<BuiltInValueExpr>
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
