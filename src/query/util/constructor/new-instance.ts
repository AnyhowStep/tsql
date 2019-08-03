import {Query} from "../../query-impl";
import {FromClauseUtil} from "../../../from-clause";

export type NewInstance = Query<{
    fromClause : FromClauseUtil.NewInstance,
}>;
export function newInstance () : NewInstance {
    const result : NewInstance = new Query({
        fromClause : FromClauseUtil.newInstance(),
    });
    return result;
}
