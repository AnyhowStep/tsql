import {UnionOrderByDelegate, UnionOrderByClauseUtil} from "../../../union-order-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {QueryUtil} from "../..";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type UnionOrderByImpl<
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
export type UnionOrderBy<
    QueryT extends IQuery
> = (
    UnionOrderByImpl<
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
    compoundQueryOrderByDelegate : UnionOrderByDelegate<QueryT["selectClause"]>
) : (
    UnionOrderBy<QueryT>
) {
    const compoundQueryOrderByClause = UnionOrderByClauseUtil.compoundQueryOrderBy<
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

    const result : UnionOrderBy<QueryT> = new Query(
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
