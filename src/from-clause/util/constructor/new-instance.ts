import {IFromClause} from "../../from-clause";

export type NewInstance = IFromClause<{
    parentJoins : undefined,
    currentJoins : undefined,
}>;
export function newInstance () : NewInstance {
    const result : NewInstance = {
        parentJoins : undefined,
        currentJoins : undefined,
    };
    return result;
}
