import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseConditionNode} from "../../../ast";
import {CaseConditionBuilder} from "./case-condition";
import {BaseType} from "../../../type-util";

export class CaseConditionBuilderImpl<
    ResultT extends unknown,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean
> implements CaseConditionBuilder<ResultT, UsedRefT, IsAggregateT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseConditionNode;

    readonly isAggregate : IsAggregateT;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseConditionNode,
        isAggregate : IsAggregateT,
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
        this.isAggregate = isAggregate;
    }

    when<
        ConditionT extends BuiltInExpr<boolean>,
        ThenT extends BuiltInExpr<BaseType<ResultT>|null>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >
    ) {
        return new CaseConditionBuilderImpl<
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >,
            IsAggregateT|BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >(
            [...this.resultMappers, BuiltInExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >(
                this.usedRef,
                BuiltInExprUtil.intersectUsedRef<
                    (ConditionT|ThenT)[]
                >(condition, then)
            ) as any,
            {
                type : "CaseCondition",
                /**
                 * https://github.com/microsoft/TypeScript/issues/33573
                 */
                branches : this.ast.branches.concat([
                    [
                        BuiltInExprUtil.buildAst(condition),
                        BuiltInExprUtil.buildAst(then)
                    ]
                ]),
                else : this.ast.else,
            },
            (
                this.isAggregate ||
                BuiltInExprUtil.isAggregate(condition) ||
                BuiltInExprUtil.isAggregate(then)
            ) as IsAggregateT|BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
            CaseConditionBuilder<
                ResultT|BuiltInExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
                >,
                IsAggregateT|BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
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
