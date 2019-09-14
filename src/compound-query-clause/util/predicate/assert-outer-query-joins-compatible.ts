import {IFromClause} from "../../../from-clause";
import {UsedRefUtil} from "../../../used-ref";
import {IJoin} from "../../../join";

export type AssertOuterQueryJoinsCompatible<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">,
    TargetFromClauseT extends Pick<IFromClause, "outerQueryJoins">
> =
    UsedRefUtil.AssertAllowed<
        UsedRefUtil.FromJoinArray<
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            FromClauseT["outerQueryJoins"] :
            []
        >,
        UsedRefUtil.FromJoinArray<
            TargetFromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            TargetFromClauseT["outerQueryJoins"] :
            []
        >
    >
;

export function assertOuterQueryJoinsCompatible (
    fromClause : Pick<IFromClause, "outerQueryJoins">,
    targetFromClause : Pick<IFromClause, "outerQueryJoins">
) {
    UsedRefUtil.assertAllowed(
        UsedRefUtil.fromJoinArray(
            fromClause.outerQueryJoins == undefined ?
            [] :
            fromClause.outerQueryJoins
        ),
        UsedRefUtil.fromJoinArray(
            targetFromClause.outerQueryJoins == undefined ?
            [] :
            targetFromClause.outerQueryJoins
        )
    );
}
