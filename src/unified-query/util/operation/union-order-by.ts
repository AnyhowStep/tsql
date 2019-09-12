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
export type UnionOrderBy<
    QueryT extends IQuery
> = (
    UnionOrderByImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function unionOrderBy<
    QueryT extends QueryUtil.AfterSelectClause
> (
    query : QueryT,
    unionOrderByDelegate : UnionOrderByDelegate<QueryT["selectClause"]>
) : (
    UnionOrderBy<QueryT>
) {
    const unionOrderByClause = UnionOrderByClauseUtil.unionOrderBy<
        QueryT["selectClause"]
    >(
        query.selectClause,
        query.unionOrderByClause,
        unionOrderByDelegate
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
        orderByClause,
        //unionOrderByClause,
    } = query;

    const result : UnionOrderBy<QueryT> = new Query(
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
