import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {Ast} from "../../../ast";
import {CaseValueBuilder, UninitializedCaseValueBuilder} from "./case-value";
import {CaseValueBuilderImpl} from "./case-value-builder-impl";

export class UninitializedCaseValueBuilderImpl<
    ValueT extends unknown,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> implements UninitializedCaseValueBuilder<ValueT, UsedRefT, IsAggregateT> {

    private readonly usedRef : UsedRefT;
    private readonly valueAst : Ast;

    readonly isAggregate : IsAggregateT;

    constructor (usedRef : UsedRefT, valueAst : Ast, isAggregate : IsAggregateT) {
        this.usedRef = usedRef;
        this.valueAst = valueAst;
        this.isAggregate = isAggregate;
    }

    when<
        CompareValueT extends BuiltInExpr<ValueT>,
        ThenT extends BuiltInExpr<unknown>
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
    ) {
        return new CaseValueBuilderImpl<
            ValueT,
            BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        >(
            [BuiltInExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >(
                this.usedRef,
                BuiltInExprUtil.intersectUsedRef<
                    (CompareValueT|ThenT)[]
                >(compareValue, then)
            ),
            {
                type : "CaseValue",
                value : this.valueAst,
                cases : [
                    [
                        BuiltInExprUtil.buildAst(compareValue),
                        BuiltInExprUtil.buildAst(then)
                    ]
                ],
                else : undefined,
            },
            (
                this.isAggregate ||
                BuiltInExprUtil.isAggregate(compareValue) ||
                BuiltInExprUtil.isAggregate(then)
            ) as IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
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
}
