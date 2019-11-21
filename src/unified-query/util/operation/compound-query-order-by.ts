import {CompoundQueryOrderByDelegate, CompoundQueryOrderByClauseUtil} from "../../../compound-query-order-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {AfterSelectClause} from "../helper-type";

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
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    MapDelegateT extends IQuery["mapDelegate"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
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
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"]
    >
);
export function compoundQueryOrderBy<
    QueryT extends AfterSelectClause
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
        mapDelegate,

        whereClause,
        groupByClause,
        havingClause,
        orderByClause,
        //compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : CompoundQueryOrderBy<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
            isDistinct,
        }
    );
    return result;
}
