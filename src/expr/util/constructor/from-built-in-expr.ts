import * as tm from "type-mapping";
import {Expr, ExprImpl, expr} from "../../expr-impl";
import {BuiltInExprUtil, AnyBuiltInExpr} from "../../../built-in-expr";
import {CustomExpr_NonCorrelated, CustomExpr_NonCorrelated_NonAggregate, CustomExprUtil} from "../../../custom-expr";
import {IAnonymousColumn} from "../../../column";
import {IUsedRef} from "../../../used-ref";

export type FromBuiltInExpr<BuiltInExprT extends AnyBuiltInExpr> = (
    Expr<{
        mapper : BuiltInExprUtil.Mapper<BuiltInExprT>,
        usedRef : BuiltInExprUtil.UsedRef<BuiltInExprT>,
        isAggregate : BuiltInExprUtil.IsAggregate<BuiltInExprT>,
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
    const isAggregate = BuiltInExprUtil.isAggregate(builtInExpr);
    const ast = BuiltInExprUtil.buildAst(builtInExpr);
    return expr(
        {
            mapper,
            usedRef,
            isAggregate,
        },
        ast
    );
}

export function fromRawExprNoUsedRefInput<
    TypeT
> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : CustomExpr_NonCorrelated_NonAggregate<TypeT>
) : (
    Expr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef<{}>,
        isAggregate : false,
    }>
);
export function fromRawExprNoUsedRefInput<
    CustomExprT extends CustomExpr_NonCorrelated<unknown>
> (
    mapper : tm.SafeMapper<CustomExprUtil.TypeOf<CustomExprT>>|IAnonymousColumn<CustomExprUtil.TypeOf<CustomExprT>>,
    value : CustomExprT
) : (
    Expr<{
        mapper : tm.SafeMapper<CustomExprUtil.TypeOf<CustomExprT>>,
        usedRef : IUsedRef<{}>,
        isAggregate : CustomExprUtil.IsAggregate<CustomExprT>,
    }>
);
export function fromRawExprNoUsedRefInput<
    CustomExprT extends CustomExpr_NonCorrelated<unknown>
> (
    mapper : tm.SafeMapper<CustomExprUtil.TypeOf<CustomExprT>>|IAnonymousColumn<CustomExprUtil.TypeOf<CustomExprT>>,
    value : CustomExprT
) : (
    Expr<{
        mapper : tm.SafeMapper<CustomExprUtil.TypeOf<CustomExprT>>,
        usedRef : IUsedRef<{}>,
        isAggregate : CustomExprUtil.IsAggregate<CustomExprT>,
    }>
) {
    if (BuiltInExprUtil.isAnyNonValueExpr(value)) {
        /**
         * Cannot map a `NonValueExpr`
         */
        return fromBuiltInExpr(value as any);
    } else {
        return fromBuiltInExpr(
            BuiltInExprUtil.fromValueExpr(
                mapper,
                value as CustomExprUtil.TypeOf<CustomExprT>
            ) as any
        );
    }
}
