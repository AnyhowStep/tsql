import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    UnionClauseT extends IQuery["compoundQueryClause"],
    UnionLimitClauseT extends IQuery["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type Where<
    QueryT extends IQuery
> = (
    WhereImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["unionLimitClause"]
    >
);
export function where<
    QueryT extends IQuery
> (
    query : QueryT,
    whereDelegate : WhereDelegate<QueryT["fromClause"]>
) : (
    Where<QueryT>
) {
    const whereClause = WhereClauseUtil.where<
        QueryT["fromClause"]
    >(
        query.fromClause,
        query.whereClause,
        whereDelegate
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        unionLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        unionOrderByClause,
    } = query;

    const result : Where<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
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
