import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {CaseConditionBuilder, UninitializedCaseConditionBuilder} from "./case-condition";
import {CaseConditionBuilderImpl} from "./case-condition-builder-impl";

export class UninitializedCaseConditionBuilderImpl implements UninitializedCaseConditionBuilder {
    constructor () {
    }

    when<
        ConditionT extends BuiltInExpr<boolean>,
        ThenT extends BuiltInExpr<unknown>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            BuiltInExprUtil.TypeOf<ThenT>,
            BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>,
            BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >
    ) {
        return new CaseConditionBuilderImpl<
            BuiltInExprUtil.TypeOf<ThenT>,
            BuiltInExprUtil.IntersectUsedRef<ConditionT|ThenT>,
            BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        >(
            [BuiltInExprUtil.mapper(then)],
            BuiltInExprUtil.intersectUsedRef<(ConditionT|ThenT)[]>(
                condition,
                then
            ),
            {
                type : "CaseCondition",
                branches : [
                    [
                        BuiltInExprUtil.buildAst(condition),
                        BuiltInExprUtil.buildAst(then)
                    ]
                ],
                else : undefined,
            },
            (
                BuiltInExprUtil.isAggregate(condition) ||
                BuiltInExprUtil.isAggregate(then)
            ) as BuiltInExprUtil.IsAggregate<ConditionT|ThenT>
        );
    }
}
