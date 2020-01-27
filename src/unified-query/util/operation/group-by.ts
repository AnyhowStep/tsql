import {GroupByDelegate, GroupByClauseUtil, GroupByClause} from "../../../group-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {AfterFromClause} from "../helper-type";
import {ColumnIdentifierUtil} from "../../../column-identifier";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type GroupByImpl<
    GroupByT extends GroupByClause,
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    MapDelegateT extends IQuery["mapDelegate"],
    GroupByClauseT extends IQuery["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseUtil.GroupBy<GroupByClauseT, GroupByT>,
    }>
);
export type GroupBy<
    QueryT extends IQuery,
    GroupByT extends GroupByClause
> = (
    GroupByImpl<
        GroupByT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function groupBy<
    QueryT extends AfterFromClause,
    GroupByT extends readonly ColumnIdentifierUtil.FromColumnRef<
        GroupByClauseUtil.AllowedColumnIdentifierRef<QueryT["fromClause"]>
    >[]
> (
    query : QueryT,
    groupByDelegate : GroupByDelegate<QueryT["fromClause"], GroupByT>
) : (
    GroupBy<QueryT, GroupByT>
) {
    const groupByClause = GroupByClauseUtil.groupBy<
        QueryT["fromClause"],
        QueryT["groupByClause"],
        GroupByT
    >(
        query.fromClause,
        query.groupByClause,
        groupByDelegate
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,

        whereClause,
        havingClause,
        orderByClause,
        compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : GroupBy<QueryT, GroupByT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        {
            whereClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
            isDistinct,
        }
    );
    return result;
}
