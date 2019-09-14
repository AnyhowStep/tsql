import {SelectClause} from "../../../select-clause";
import {QueryBaseUtil} from "../../../query-base";
import {IFromClause} from "../../../from-clause";
import {AssertSelectClauseCompatible, assertSelectClauseCompatible} from "./assert-select-clause-compatible";
import {AssertOuterQueryJoinsCompatible, assertOuterQueryJoinsCompatible} from "./assert-outer-query-joins-compatible";

export type AssertCompatible<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">,
    SelectClauseT extends SelectClause,
    TargetQueryT extends QueryBaseUtil.AfterSelectClause
> =
    & AssertSelectClauseCompatible<SelectClauseT, TargetQueryT["selectClause"]>
    & AssertOuterQueryJoinsCompatible<FromClauseT, TargetQueryT["fromClause"]>
;

export function assertCompatible (
    fromClause : Pick<IFromClause, "outerQueryJoins">,
    selectClause : SelectClause,
    targetQuery : QueryBaseUtil.AfterSelectClause
) {
    assertSelectClauseCompatible(selectClause, targetQuery.selectClause);
    assertOuterQueryJoinsCompatible(fromClause, targetQuery.fromClause);
}
