import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseWhenNode} from "../../../ast";
import {CaseConditionBuilder} from "./case-condition";
import {ComparableExpr, ComparableExprUtil} from "../../../comparable-expr";

export class CaseConditionBuilderImpl<
    ResultT extends ComparableExpr,
    UsedRefT extends IUsedRef
> implements CaseConditionBuilder<ResultT, UsedRefT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseWhenNode;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseWhenNode,
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
    }

    when<
        ConditionT extends RawExpr<boolean>,
        ThenT extends RawExpr<ComparableExprUtil.ComparableType<ResultT>|null>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            ResultT|RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >
        >
    ) {
        return new CaseConditionBuilderImpl<
            ResultT|RawExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >
        >(
            [...this.resultMappers, RawExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
            >(
                this.usedRef,
                RawExprUtil.intersectUsedRef<
                    (ConditionT|ThenT)[]
                >(condition, then)
            ) as any,
            {
                type : "CaseWhen",
                /**
                 * https://github.com/microsoft/TypeScript/issues/33573
                 */
                branches : this.ast.branches.concat([
                    RawExprUtil.buildAst(condition),
                    RawExprUtil.buildAst(then)
                ]),
                else : this.ast.else,
            }
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
            CaseConditionBuilder<
                ResultT|RawExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
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