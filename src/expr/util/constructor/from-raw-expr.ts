import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {RawExpr, RawExprUtil, RawExprNoUsedRef_Input} from "../../../raw-expr";
import {PrimitiveExpr} from "../../../primitive-expr";
import {IAnonymousColumn} from "../../../column";
import {DataTypeUtil} from "../../../data-type";
import {IUsedRef} from "../../../used-ref";

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
    if (RawExprUtil.isAnyNonPrimitiveRawExpr(value)) {
        /**
         * Cannot map a `NonPrimitiveRawExpr`
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
