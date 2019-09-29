import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseConditionBuilderImpl} from "./uninitialized-case-condition-builder-impl";
import {EquatableTypeUtil, EquatableType} from "../../../equatable-type";

export interface CaseConditionBuilder<
    ResultT extends EquatableType,
    UsedRefT extends IUsedRef
> {
    when<
        ConditionT extends RawExpr<boolean>,
        ThenT extends RawExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
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
                | RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
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
export interface UninitializedCaseConditionBuilder {
    when<
        ConditionT extends RawExpr<boolean>,
        ThenT extends RawExpr<EquatableType>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            RawExprUtil.TypeOf<ThenT>,
            RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
        >
    );
}
export function caseCondition () : (
    UninitializedCaseConditionBuilder
) {
    return new UninitializedCaseConditionBuilderImpl();
}
