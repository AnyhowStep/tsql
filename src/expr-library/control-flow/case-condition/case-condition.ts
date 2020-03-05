import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseConditionBuilderImpl} from "./uninitialized-case-condition-builder-impl";
import {BaseType} from "../../../type-util";

export interface CaseConditionBuilder<
    ResultT extends unknown,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> {
    readonly isAggregate : IsAggregateT;

    when<
        ConditionT extends BuiltInExpr<boolean>,
        ThenT extends BuiltInExpr<BaseType<ResultT>|null>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
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
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >
    );
    /**
     * Calling `.end()` without an `ELSE` clause can
     * cause the result to be `null`
     */
    end () : ExprImpl<ResultT|null, UsedRefT, IsAggregateT>;
    else<
        ElseT extends BuiltInExpr<BaseType<ResultT>|null>
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
export interface UninitializedCaseConditionBuilder {
    when<
        ConditionT extends BuiltInExpr<boolean>,
        ThenT extends BuiltInExpr<unknown>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            BuiltInExprUtil.TypeOf<ThenT>,
            BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>,
            BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >
    );
}
export function caseCondition () : (
    UninitializedCaseConditionBuilder
) {
    return new UninitializedCaseConditionBuilderImpl();
}
