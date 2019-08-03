import {IFromClause} from "../../from-clause";

export function assertAfterFromClause (
    fromClause : IFromClause
) {
    if (fromClause.currentJoins == undefined) {
        throw new Error(`Must be after FROM clause`);
    }
}
