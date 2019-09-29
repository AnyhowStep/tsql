import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseValueBuilderImpl} from "./uninitialized-case-value-builder-impl";
import {NonNullEquatableType, EquatableTypeUtil, EquatableType} from "../../../equatable-type";

export interface CaseValueBuilder<
    ValueT extends NonNullEquatableType,
    ResultT extends EquatableType,
    UsedRefT extends IUsedRef
> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends RawExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            ResultT|RawExprUtil.TypeOf<ThenT>,
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
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    );
    /**
     * Calling `.end()` without an `ELSE` clause can
     * cause the result to be `null`
     */
    end () : ExprImpl<ResultT|null, UsedRefT>;
    else<
        ElseT extends RawExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        elseResult : ElseT
    ) : (
        {
            end () : ExprImpl<
                ResultT|RawExprUtil.TypeOf<ElseT>,
                UsedRefUtil.Intersect<
                    | UsedRefT
                    | RawExprUtil.UsedRef<ElseT>
                >
            >
        }
    );
}
export interface UninitializedCaseValueBuilder<ValueT extends NonNullEquatableType, UsedRefT extends IUsedRef> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends RawExpr<EquatableType>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    );
}
export function caseValue<
    ValueExprT extends RawExpr<NonNullEquatableType>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseValueBuilder<
        EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >
) {
    return new UninitializedCaseValueBuilderImpl<
        EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >(
        RawExprUtil.usedRef<ValueExprT>(valueExpr),
        RawExprUtil.buildAst(valueExpr)
    ) as (
        /**
         * @todo Investigate type instantiation exessively deep error
         */
        UninitializedCaseValueBuilder<
            EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<ValueExprT>>,
            RawExprUtil.UsedRef<ValueExprT>
        >
    );
}
