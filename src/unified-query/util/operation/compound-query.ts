import {Query} from "../../query-impl";
import {CompoundQueryClause, CompoundQueryClauseUtil} from "../../../compound-query-clause";
import {QueryBaseUtil} from "../../../query-base";
import {SelectClauseUtil, SelectClause} from "../../../select-clause";
import {CompoundQueryType} from "../../../compound-query";
import {AssertNonUnion} from "../../../type-util";
import {AfterSelectClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CompoundQueryImpl<
    TargetSelectClauseT extends SelectClause,
    FromClauseT extends AfterSelectClause["fromClause"],
    SelectClauseT extends AfterSelectClause["selectClause"],
    LimitClauseT extends AfterSelectClause["limitClause"],
    //CompoundQueryClauseT extends AfterSelectClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterSelectClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterSelectClause["mapDelegate"],
    GroupByClauseT extends AfterSelectClause["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseUtil.LeftCompound<
            SelectClauseT,
            TargetSelectClauseT
        >,

        limitClause : LimitClauseT,

        /**
         * We don't need to have a specific type here
         */
        compoundQueryClause : CompoundQueryClause,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type CompoundQuery<
    QueryT extends AfterSelectClause,
    TargetQueryT extends QueryBaseUtil.AfterSelectClause
> = (
    CompoundQueryImpl<
        TargetQueryT["selectClause"],
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        //QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function compoundQuery<
    QueryT extends AfterSelectClause,
    TargetQueryT extends QueryBaseUtil.AfterSelectClause
> (
    query : QueryT,
    compoundQueryType : CompoundQueryType,
    isDistinct : boolean,
    targetQuery : (
        & TargetQueryT
        & CompoundQueryClauseUtil.AssertCompatible<
            QueryT["fromClause"],
            QueryT["selectClause"],
            TargetQueryT
        >
    )
) : (
    CompoundQuery<QueryT, TargetQueryT>
) {
    const {
        selectClause,
        compoundQueryClause,
    } = CompoundQueryClauseUtil.compoundQuery<
        QueryT["fromClause"],
        QueryT["selectClause"],
        TargetQueryT
    >(
        query.fromClause,
        query.selectClause as (QueryT["selectClause"] & AssertNonUnion<QueryT["selectClause"]>),
        query.compoundQueryClause,
        compoundQueryType,
        isDistinct,
        targetQuery
    );

    const {
        fromClause,
        //selectClause,

        limitClause,

        //compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : CompoundQuery<QueryT, TargetQueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        query
    );
    return result as any;
}
