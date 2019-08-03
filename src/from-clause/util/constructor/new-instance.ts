import {IFromClause} from "../../from-clause";

export type NewInstance = IFromClause<{
    outerQueryJoins : undefined,
    currentJoins : undefined,
}>;
export function newInstance () : NewInstance {
    const result : NewInstance = {
        outerQueryJoins : undefined,
        currentJoins : undefined,
    };
    return result;
}
