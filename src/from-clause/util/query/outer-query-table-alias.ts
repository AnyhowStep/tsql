import {IFromClause} from "../../from-clause";
import {IJoin, JoinArrayUtil} from "../../../join";

export type OuterQueryTableAlias<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">
> =
    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
    JoinArrayUtil.TableAlias<FromClauseT["outerQueryJoins"]> :
    never
;
export function outerQueryTableAlias<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">
> (
    fromClause : FromClauseT
) : (
    OuterQueryTableAlias<FromClauseT>[]
) {
    if (fromClause.outerQueryJoins == undefined) {
        return [];
    } else {
        return fromClause.outerQueryJoins.map(join => join.tableAlias) as OuterQueryTableAlias<FromClauseT>[];
    }
}
