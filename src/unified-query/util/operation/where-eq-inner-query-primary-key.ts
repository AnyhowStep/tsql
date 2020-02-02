import {FromClauseUtil} from "../../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {Query} from "../../query-impl";
import {AfterFromClause, Correlated} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqInnerQueryPrimaryKeyImpl<
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
    GroupByClauseT extends AfterFromClause["groupByClause"],
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
export type WhereEqInnerQueryPrimaryKey<
    QueryT extends AfterFromClause
> = (
    WhereEqInnerQueryPrimaryKeyImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function whereEqInnerQueryPrimaryKey<
    QueryT extends (Correlated & AfterFromClause),
    SrcT extends QueryT["fromClause"]["outerQueryJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<QueryT["fromClause"]["currentJoins"], SrcT["columns"]>
> (
    query : QueryT,
    srcDelegate : FromClauseUtil.WhereEqInnerQueryPrimaryKeySrcDelegate<QueryT["fromClause"], SrcT>,
    dstDelegate : (
        FromClauseUtil.WhereEqInnerQueryPrimaryKeyDstDelegate<
            QueryT["fromClause"],
            SrcT,
            DstT
        >
    )
) : (
    WhereEqInnerQueryPrimaryKey<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqInnerQueryPrimaryKey<
        QueryT["fromClause"],
        SrcT,
        DstT
    >(
        query.fromClause,
        query.whereClause,
        srcDelegate,
        dstDelegate
    );

    const {
        //fromClause,
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

    const result : WhereEqInnerQueryPrimaryKey<QueryT> = new Query(
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
