import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {Ast} from "../../../ast";
import {CaseBuilder, UninitializedCaseBuilder} from "./case-value";
import {CaseBuilderImpl} from "./case-builder-impl";
import {NonNullComparableExpr, ComparableExpr} from "../../../comparable-expr";

export class UninitializedCaseBuilderImpl<
    ValueT extends NonNullComparableExpr,
    UsedRefT extends IUsedRef
> implements UninitializedCaseBuilder<ValueT, UsedRefT> {
    private readonly usedRef : UsedRefT;
    private readonly valueAst : Ast;

    constructor (usedRef : UsedRefT, valueAst : Ast) {
        this.usedRef = usedRef;
        this.valueAst = valueAst;
    }

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
    ) {
        return new CaseBuilderImpl<
            ValueT,
            RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >(
            [RawExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >(
                this.usedRef,
                RawExprUtil.intersectUsedRef<
                    (CompareValueT|ThenT)[]
                >(compareValue, then)
            ),
            {
                type : "Case",
                value : this.valueAst,
                cases : [
                    [
                        RawExprUtil.buildAst(compareValue),
                        RawExprUtil.buildAst(then)
                    ]
                ],
                else : undefined,
            }
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
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
}
