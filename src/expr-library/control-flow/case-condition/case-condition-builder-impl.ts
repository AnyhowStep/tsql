import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseConditionNode} from "../../../ast";
import {CaseConditionBuilder} from "./case-condition";
import {EquatableType, EquatableTypeUtil} from "../../../equatable-type";

export class CaseConditionBuilderImpl<
    ResultT extends EquatableType,
    UsedRefT extends IUsedRef
> implements CaseConditionBuilder<ResultT, UsedRefT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseConditionNode;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseConditionNode,
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
    }

    when<
        ConditionT extends BuiltInExpr<boolean>,
        ThenT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >
        >
    ) {
        return new CaseConditionBuilderImpl<
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >
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
                    BuiltInExprUtil.buildAst(condition),
                    BuiltInExprUtil.buildAst(then)
                ]),
                else : this.ast.else,
            }
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
            CaseConditionBuilder<
                ResultT|BuiltInExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>
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
        ElseT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        elseResult : ElseT
    ) : (
        {
            end () : ExprImpl<
                ResultT|BuiltInExprUtil.TypeOf<ElseT>,
                UsedRefUtil.Intersect<
                    | UsedRefT
                    | BuiltInExprUtil.UsedRef<ElseT>
                >
            >
        }
    ) {
        const end = () : ExprImpl<
            ResultT|BuiltInExprUtil.TypeOf<ElseT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.UsedRef<ElseT>
            >
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
                },
                this.ast
            );
        };
        return {
            end,
        };
    }
}
