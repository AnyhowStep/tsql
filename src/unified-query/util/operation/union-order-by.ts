import {CompoundQueryOrderByDelegate, CompoundQueryOrderByClauseUtil} from "../../../union-order-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {QueryUtil} from "../..";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CompoundQueryOrderByImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    UnionClauseT extends IQuery["compoundQueryClause"],
    UnionLimitClauseT extends IQuery["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        compoundQueryLimitClause : UnionLimitClauseT,
    }>
);
export type CompoundQueryOrderBy<
    QueryT extends IQuery
> = (
    CompoundQueryOrderByImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export function compoundQueryOrderBy<
    QueryT extends QueryUtil.AfterSelectClause
> (
    query : QueryT,
    compoundQueryOrderByDelegate : CompoundQueryOrderByDelegate<QueryT["selectClause"]>
) : (
    CompoundQueryOrderBy<QueryT>
) {
    const compoundQueryOrderByClause = CompoundQueryOrderByClauseUtil.compoundQueryOrderBy<
        QueryT["selectClause"]
    >(
        query.selectClause,
        query.compoundQueryOrderByClause,
        compoundQueryOrderByDelegate
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,

        whereClause,
        groupByClause,
        havingClause,
        orderByClause,
        //compoundQueryOrderByClause,
    } = query;

    const result : CompoundQueryOrderBy<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
        }
    );
    return result;
}
