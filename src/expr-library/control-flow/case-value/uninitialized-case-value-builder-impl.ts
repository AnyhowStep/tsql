import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {Ast} from "../../../ast";
import {CaseValueBuilder, UninitializedCaseValueBuilder} from "./case-value";
import {CaseValueBuilderImpl} from "./case-value-builder-impl";
import {NonNullEquatableType, EquatableType} from "../../../equatable-type";

export class UninitializedCaseValueBuilderImpl<
    ValueT extends NonNullEquatableType,
    UsedRefT extends IUsedRef
> implements UninitializedCaseValueBuilder<ValueT, UsedRefT> {
    private readonly usedRef : UsedRefT;
    private readonly valueAst : Ast;

    constructor (usedRef : UsedRefT, valueAst : Ast) {
        this.usedRef = usedRef;
        this.valueAst = valueAst;
    }

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
            >
        >
    ) {
        return new CaseValueBuilderImpl<
            ValueT,
            BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
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
            }
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
                >
            >
        );
    }
}
