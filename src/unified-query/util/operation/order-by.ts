import {OrderByDelegate, OrderByClauseUtil} from "../../../order-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type OrderByImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    UnionClauseT extends IQuery["unionClause"],
    UnionLimitClauseT extends IQuery["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        unionClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type OrderBy<
    QueryT extends IQuery
> = (
    OrderByImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function orderBy<
    QueryT extends IQuery
> (
    query : QueryT,
    orderByDelegate : OrderByDelegate<QueryT["fromClause"], QueryT["selectClause"]>
) : (
    OrderBy<QueryT>
) {
    const orderByClause = OrderByClauseUtil.orderBy<
        QueryT["fromClause"],
        QueryT["selectClause"]
    >(
        query.fromClause,
        query.selectClause,
        query.orderByClause,
        orderByDelegate
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        unionClause,
        unionLimitClause,

        whereClause,
        groupByClause,
        havingClause,
        unionOrderByClause,
    } = query;

    const result : OrderBy<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            unionClause,
            unionLimitClause,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            unionOrderByClause,
        }
    );
    return result;
}
