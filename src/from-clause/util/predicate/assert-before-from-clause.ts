import {IFromClause} from "../../from-clause";

export function assertBeforeFromClause (
    fromClause : IFromClause
) {
    if (fromClause.currentJoins != undefined) {
        throw new Error(`Must be before FROM clause`);
    }
}
