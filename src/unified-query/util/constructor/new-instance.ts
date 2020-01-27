import {FromClauseUtil} from "../../../from-clause";
import {Query} from "../../query-impl";

export type NewInstance = Query<{
    fromClause : FromClauseUtil.NewInstance,
    selectClause : undefined,

    limitClause : undefined,

    compoundQueryClause : undefined,
    compoundQueryLimitClause : undefined,

    mapDelegate : undefined,
    groupByClause : undefined,
}>;
export function newInstance () : NewInstance {
    const result : NewInstance = new Query(
        {
            fromClause : FromClauseUtil.newInstance(),
            selectClause : undefined,

            limitClause : undefined,

            compoundQueryClause : undefined,
            compoundQueryLimitClause : undefined,

            mapDelegate : undefined,
            groupByClause : undefined,
        },
        {
            whereClause : undefined,
            havingClause : undefined,
            orderByClause : undefined,
            compoundQueryOrderByClause : undefined,
            isDistinct : false,
        }
    );
    return result;
}
