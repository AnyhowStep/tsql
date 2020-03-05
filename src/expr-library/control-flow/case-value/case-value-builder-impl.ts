import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseValueNode} from "../../../ast";
import {CaseValueBuilder} from "./case-value";
import {BaseType} from "../../../type-util";

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
    ValueT extends unknown,
    ResultT extends unknown,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> implements CaseValueBuilder<ValueT, ResultT, UsedRefT, IsAggregateT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseValueNode;

    readonly isAggregate : IsAggregateT;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseValueNode,
        isAggregate : IsAggregateT
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
        this.isAggregate = isAggregate;
    }

    when<
        CompareValueT extends BuiltInExpr<ValueT>,
        ThenT extends BuiltInExpr<BaseType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        >
    ) {
        return new CaseValueBuilderImpl<
            ValueT,
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
        >(
            [...this.resultMappers, BuiltInExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >(
                this.usedRef,
                BuiltInExprUtil.intersectUsedRef<
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
                    [
                        BuiltInExprUtil.buildAst(compareValue),
                        BuiltInExprUtil.buildAst(then)
                    ]
                ]),
                else : this.ast.else,
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
                ResultT|BuiltInExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
                >,
                IsAggregateT|BuiltInExprUtil.IsAggregate<CompareValueT|ThenT>
            >
        );
    }
    end () : ExprImpl<ResultT|null, UsedRefT, IsAggregateT> {
        return expr(
            {
                mapper : tm.unsafeOr(...this.resultMappers, tm.null()),
                usedRef : this.usedRef,
                isAggregate : this.isAggregate,
            },
            this.ast
        );
    }
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
    ) {
        const end = () : ExprImpl<
            ResultT|BuiltInExprUtil.TypeOf<ElseT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.UsedRef<ElseT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<ElseT>
        > => {
            return expr(
                {
                    mapper : tm.unsafeOr(...this.resultMappers, BuiltInExprUtil.mapper(elseResult)),
                    usedRef : UsedRefUtil.intersect<
                        | UsedRefT
                        | BuiltInExprUtil.UsedRef<ElseT>
                    >(
                        this.usedRef,
                        BuiltInExprUtil.usedRef(elseResult)
                    ),
                    isAggregate : (
                        this.isAggregate ||
                        BuiltInExprUtil.isAggregate(elseResult)
                    ) as IsAggregateT|BuiltInExprUtil.IsAggregate<ElseT>
                },
                {
                    ...this.ast,
                    else : BuiltInExprUtil.buildAst(elseResult),
                }
            );
        };
        return {
            end,
        };
    }
}
