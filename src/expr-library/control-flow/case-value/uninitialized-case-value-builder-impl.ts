import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {Ast} from "../../../ast";
import {CaseValueBuilder, UninitializedCaseValueBuilder} from "./case-value";
import {CaseValueBuilderImpl} from "./case-value-builder-impl";
import {NonNullComparableExpr, ComparableExpr} from "../../../comparable-expr";

export class UninitializedCaseValueBuilderImpl<
    ValueT extends NonNullComparableExpr,
    UsedRefT extends IUsedRef
> implements UninitializedCaseValueBuilder<ValueT, UsedRefT> {
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
        CaseValueBuilder<
            ValueT,
            RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    ) {
        return new CaseValueBuilderImpl<
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
}
