import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {CaseConditionBuilder, UninitializedCaseConditionBuilder} from "./case-condition";
import {CaseConditionBuilderImpl} from "./case-condition-builder-impl";
import {ComparableExpr} from "../../../comparable-expr";

export class UninitializedCaseConditionBuilderImpl implements UninitializedCaseConditionBuilder {
    constructor () {
    }

    when<
        ConditionT extends RawExpr<boolean>,
        ThenT extends RawExpr<ComparableExpr>
    > (
        condition : ConditionT,
        then : ThenT
    ) : (
        CaseConditionBuilder<
            RawExprUtil.TypeOf<ThenT>,
            RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
        >
    ) {
        return new CaseConditionBuilderImpl<
            RawExprUtil.TypeOf<ThenT>,
            RawExprUtil.IntersectUsedRef<ConditionT|ThenT>
        >(
            [RawExprUtil.mapper(then)],
            RawExprUtil.intersectUsedRef<(ConditionT|ThenT)[]>(
                condition,
                then
            ),
            {
                type : "CaseWhen",
                branches : [
                    [
                        RawExprUtil.buildAst(condition),
                        RawExprUtil.buildAst(then)
                    ]
                ],
                else : undefined,
            }
        );
    }
}
