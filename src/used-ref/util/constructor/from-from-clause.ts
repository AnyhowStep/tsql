import {IFromClause} from "../../../from-clause";
import {IJoin} from "../../../join";
import {FromJoinArray, fromJoinArray} from "./from-join-array";

export type FromFromClause<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">
> = (
    FromJoinArray<
        (
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            FromClauseT["outerQueryJoins"] :
            never
        )
    >
);
export function fromFromClause<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">
> (
    fromClause : FromClauseT
) : (
    FromFromClause<FromClauseT>
) {
    return fromJoinArray(
        fromClause.outerQueryJoins == undefined ?
        [] :
        fromClause.outerQueryJoins
    );
}
