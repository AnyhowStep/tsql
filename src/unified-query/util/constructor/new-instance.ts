import {FromClauseUtil} from "../../../from-clause";
import {Query} from "../../query-impl";

export type NewInstance = Query<{
    fromClause : FromClauseUtil.NewInstance,
    selectClause : undefined,

    limitClause : undefined,

    compoundQueryClause : undefined,
    compoundQueryLimitClause : undefined,
}>;
export function newInstance () : NewInstance {
    const result : NewInstance = new Query(
        {
            fromClause : FromClauseUtil.newInstance(),
            selectClause : undefined,

            limitClause : undefined,

            compoundQueryClause : undefined,
            compoundQueryLimitClause : undefined,
        },
        {
            whereClause : undefined,
            groupByClause : undefined,
            havingClause : undefined,
            orderByClause : undefined,
            compoundQueryOrderByClause : undefined,
            distinct : false,
        }
    );
    return result;
}
