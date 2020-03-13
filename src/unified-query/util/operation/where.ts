import {WhereClauseUtil, WhereDelegateColumns, WhereDelegateReturnType} from "../../../where-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {Correlate, correlate} from "./correlate";

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
        groupByClause : GroupByClauseT,
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
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);

export type QueryWhereDelegate<
    QueryT extends IQuery
> =
    (
        columns : WhereDelegateColumns<QueryT["fromClause"]>,
        subquery : Correlate<QueryT>
    ) => WhereDelegateReturnType<QueryT["fromClause"]>
;


export function where<
    QueryT extends IQuery
> (
    query : QueryT,
    whereDelegate : QueryWhereDelegate<QueryT>
) : (
    Where<QueryT>
) {
    const whereClause = WhereClauseUtil.where<
        QueryT["fromClause"]
    >(
        query.fromClause,
        query.whereClause,
        (columns) => {
            return whereDelegate(columns, correlate<QueryT>(query));
        }
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,

        havingClause,
        orderByClause,
        compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : Where<QueryT> = new Query(
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
