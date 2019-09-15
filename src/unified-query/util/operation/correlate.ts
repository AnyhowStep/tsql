import {FromClauseUtil} from "../../../from-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";

export type Correlate<QueryT extends Pick<IQuery, "fromClause">> =
    Query<{
        fromClause : FromClauseUtil.Correlate<QueryT["fromClause"]>,
        selectClause : undefined,

        limitClause : undefined,

        compoundQueryClause : undefined,
        compoundQueryLimitClause : undefined,
    }>
;

/**
 * @todo A reference to the `query` needs to be added to the following,
 * + `OnDelegate`
 * + `HavingDelegate`
 * + `OrderByDelegate`
 * + `SelectDelegate`
 * + `WhereDelegate`
 *
 * Basically, anywhere a correlated subquery is allowed.
 */
export function correlate<QueryT extends Pick<IQuery, "fromClause">> (
    query : QueryT
) : (
    Correlate<QueryT>
) {
    const result : Correlate<QueryT> = new Query(
        {
            fromClause : FromClauseUtil.correlate<QueryT["fromClause"]>(query.fromClause),
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
