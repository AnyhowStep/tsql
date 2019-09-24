import {AnyRawExpr, RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {UninitializedCaseBuilderImpl} from "./uninitialized-case-builder-impl";

export interface CaseBuilder<
    ValueT,
    ResultT,
    UsedRefT extends IUsedRef
> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends AnyRawExpr
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseBuilder<
            ValueT,
            ResultT|RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    );
    end () : ExprImpl<ResultT, UsedRefT>;
    else<ElseT extends AnyRawExpr> (
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
export interface UninitializedCaseBuilder<ValueT, UsedRefT extends IUsedRef> {
    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends AnyRawExpr
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
    ValueT extends AnyRawExpr
> (
    value : ValueT
) : (
    UninitializedCaseBuilder<
        RawExprUtil.TypeOf<ValueT>,
        RawExprUtil.UsedRef<ValueT>
    >
) {
    return new UninitializedCaseBuilderImpl<
        RawExprUtil.TypeOf<ValueT>,
        RawExprUtil.UsedRef<ValueT>
    >(
        RawExprUtil.usedRef<ValueT>(value),
        RawExprUtil.buildAst(value)
    );
}
