import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseValueNode} from "../../../ast";
import {CaseValueBuilder} from "./case-value";
import {NonNullComparableExpr, ComparableExpr, ComparableExprUtil} from "../../../comparable-expr";

/**
 * Workaround for,
 * https://github.com/microsoft/TypeScript/issues/33573
 */
declare global {
    interface ReadonlyArray<T> {
        concat (
            this : readonly [T, ...T[]],
            ...items: (T | ConcatArray<T>)[]
        ) : ([T, ...T[]])
    }
    interface Array<T> {
        concat (
            this : readonly [T, ...T[]],
            ...items: (T | ConcatArray<T>)[]
        ) : ([T, ...T[]])
    }
}

export class CaseValueBuilderImpl<
    ValueT extends NonNullComparableExpr,
    ResultT extends ComparableExpr,
    UsedRefT extends IUsedRef
> implements CaseValueBuilder<ValueT, ResultT, UsedRefT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseValueNode;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseValueNode,
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
    }

    when<
        CompareValueT extends RawExpr<ValueT>,
        ThenT extends RawExpr<ComparableExprUtil.ComparableType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            ResultT|RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    ) {
        return new CaseValueBuilderImpl<
            ValueT,
            ResultT|RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >(
            [...this.resultMappers, RawExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >(
                this.usedRef,
                RawExprUtil.intersectUsedRef<
                    (CompareValueT|ThenT)[]
                >(compareValue, then)
            ) as any,
            {
                type : "CaseValue",
                value : this.ast.value,
                /**
                 * https://github.com/microsoft/TypeScript/issues/33573
                 */
                cases : this.ast.cases.concat([
                    RawExprUtil.buildAst(compareValue),
                    RawExprUtil.buildAst(then)
                ]),
                else : this.ast.else,
            }
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
            CaseValueBuilder<
                ValueT,
                ResultT|RawExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | RawExprUtil.IntersectUsedRef<CompareValueT|ThenT>
                >
            >
        );
    }
    end () : ExprImpl<ResultT|null, UsedRefT> {
        return expr(
            {
                mapper : tm.unsafeOr(...this.resultMappers, tm.null()),
                usedRef : this.usedRef,
            },
            this.ast
        );
    }
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
    ) {
        const end = () : ExprImpl<
            ResultT|RawExprUtil.TypeOf<ElseT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | RawExprUtil.UsedRef<ElseT>
            >
        > => {
            return expr(
                {
                    mapper : tm.unsafeOr(...this.resultMappers, RawExprUtil.mapper(elseResult)),
                    usedRef : UsedRefUtil.intersect<
                        | UsedRefT
                        | RawExprUtil.UsedRef<ElseT>
                    >(
                        this.usedRef,
                        RawExprUtil.usedRef(elseResult)
                    ),
                },
                this.ast
            );
        };
        return {
            end,
        };
    }
}
