import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseValueBuilderImpl} from "./uninitialized-case-value-builder-impl";
import {NonNullEquatableType, EquatableTypeUtil, EquatableType} from "../../../equatable-type";

export interface CaseValueBuilder<
    ValueT extends NonNullEquatableType,
    ResultT extends EquatableType,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> {
    readonly isAggregate : IsAggregateT;

    when<
        CompareValueT extends BuiltInExpr<ValueT>,
        ThenT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            /**
             * This is needed to chain many `.when()` calls.
             *
             * Without `IntersectTryReuseExistingType<>`,
             * we can only chain 10+ calls.
             *
             * With it, we can chain 100+ calls.
             */
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        >
    );
    /**
     * Calling `.end()` without an `ELSE` clause can
     * cause the result to be `null`
     */
    end () : ExprImpl<ResultT|null, UsedRefT, IsAggregateT>;
    else<
        ElseT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        elseResult : ElseT
    ) : (
        {
            end () : ExprImpl<
                ResultT|BuiltInExprUtil.TypeOf<ElseT>,
                UsedRefUtil.Intersect<
                    | UsedRefT
                    | BuiltInExprUtil.UsedRef<ElseT>
                >,
                IsAggregateT|BuiltInExprUtil.IsAggregate<ElseT>
            >
        }
    );
}
export interface UninitializedCaseValueBuilder<
    ValueT extends NonNullEquatableType,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> {
    readonly isAggregate : IsAggregateT;

    when<
        CompareValueT extends BuiltInExpr<ValueT>,
        ThenT extends BuiltInExpr<EquatableType>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        >
    );
}
export function caseValue<
    ValueExprT extends BuiltInExpr<NonNullEquatableType>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseValueBuilder<
        EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<ValueExprT>>,
        BuiltInExprUtil.UsedRef<ValueExprT>,
        BuiltInExprUtil.IsAggregate<ValueExprT>
    >
) {
    return new UninitializedCaseValueBuilderImpl<
        EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<ValueExprT>>,
        BuiltInExprUtil.UsedRef<ValueExprT>,
        BuiltInExprUtil.IsAggregate<ValueExprT>
    >(
        BuiltInExprUtil.usedRef<ValueExprT>(valueExpr),
        BuiltInExprUtil.buildAst(valueExpr),
        BuiltInExprUtil.isAggregate(valueExpr)
    ) as (
        /**
         * @todo Investigate type instantiation exessively deep error
         */
        UninitializedCaseValueBuilder<
            EquatableTypeUtil.BaseNonNullEquatableType<BuiltInExprUtil.TypeOf<ValueExprT>>,
            BuiltInExprUtil.UsedRef<ValueExprT>,
            BuiltInExprUtil.IsAggregate<ValueExprT>
        >
    );
}
