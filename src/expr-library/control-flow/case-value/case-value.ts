import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseBuilderImpl} from "./uninitialized-case-builder-impl";
import {NonNullComparableExpr, ComparableExprUtil, ComparableExpr} from "../../../comparable-expr";

export interface CaseBuilder<
    ValueT extends NonNullComparableExpr,
    ResultT extends ComparableExpr,
    UsedRefT extends IUsedRef
> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends RawExpr<ComparableExprUtil.ComparableType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseBuilder<
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
        ElseT extends RawExpr<ComparableExprUtil.ComparableType<ResultT>|null>
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
export interface UninitializedCaseBuilder<ValueT extends NonNullComparableExpr, UsedRefT extends IUsedRef> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends RawExpr<ComparableExpr>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseBuilder<
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
    ValueExprT extends RawExpr<NonNullComparableExpr>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseBuilder<
        ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >
) {
    return new UninitializedCaseBuilderImpl<
        ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >(
        RawExprUtil.usedRef<ValueExprT>(valueExpr),
        RawExprUtil.buildAst(valueExpr)
    ) as (
        /**
         * @todo Investigate type instantiation exessively deep error
         */
        UninitializedCaseBuilder<
            ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<ValueExprT>>,
            RawExprUtil.UsedRef<ValueExprT>
        >
    );
}
