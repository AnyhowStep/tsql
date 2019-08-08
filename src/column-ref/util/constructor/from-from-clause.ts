import {IFromClause} from "../../../from-clause";
import {IJoin} from "../../../join";
import {FromJoinArray, setJoinArray} from "./from-join-array";
import {WritableColumnRef} from "../../column-ref";

/**
 * Moon moon
 */
export type FromFromClause<
    FromClauseT extends IFromClause
> = (
    & (
        FromClauseT["currentJoins"] extends readonly IJoin[] ?
        FromJoinArray<FromClauseT["currentJoins"]> :
        {}
    )
    & (
        FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
        FromJoinArray<FromClauseT["outerQueryJoins"]> :
        {}
    )
);
export function setFromClause (ref : WritableColumnRef, fromClause : IFromClause) {
    if (fromClause.currentJoins != undefined) {
        setJoinArray(ref, fromClause.currentJoins);
    }
    if (fromClause.outerQueryJoins != undefined) {
        setJoinArray(ref, fromClause.outerQueryJoins);
    }
}
export function fromFromClause<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    FromFromClause<FromClauseT>
) {
    const result : WritableColumnRef = {};
    setFromClause(result, fromClause);
    return result as FromFromClause<FromClauseT>;
}
