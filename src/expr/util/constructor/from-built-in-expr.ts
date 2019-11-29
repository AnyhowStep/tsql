import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {RawExprUtil, RawExprNoUsedRef_Input, AnyBuiltInExpr} from "../../../raw-expr";
import {IAnonymousColumn} from "../../../column";
import {DataTypeUtil} from "../../../data-type";
import {IUsedRef} from "../../../used-ref";

export type FromBuiltInExpr<BuiltInExprT extends AnyBuiltInExpr> = (
    Expr<{
        mapper : RawExprUtil.Mapper<BuiltInExprT>,
        usedRef : RawExprUtil.UsedRef<BuiltInExprT>,
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
    const mapper = RawExprUtil.mapper(builtInExpr);
    const usedRef = RawExprUtil.usedRef(builtInExpr);
    const ast = RawExprUtil.buildAst(builtInExpr);
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
