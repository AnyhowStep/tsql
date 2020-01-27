import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {MapDelegate} from "../../../../map-delegate";
import {ExecutionUtil} from "../../../../execution";
import {AfterSelectClause, NonCorrelated, Unmapped} from "../../helper-type";

export type InitialMapDelegate<
    QueryT extends AfterSelectClause & NonCorrelated & Unmapped,
    NxtReturnT
> =
    MapDelegate<
        ExecutionUtil.UnmappedRow<QueryT>,
        ExecutionUtil.UnmappedRow<QueryT>,
        NxtReturnT
    >
;

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type MapInitialImpl<
    NewMapDelegateT extends MapDelegate,
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    GroupByClauseT extends IQuery["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : NewMapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type MapInitial<
    QueryT extends AfterSelectClause & NonCorrelated & Unmapped,
    NxtReturnT
> = (
    MapInitialImpl<
        /**
         * Erase some compile-time data, we are only interested in the return type.
         */
        MapDelegate<never, never, NxtReturnT>,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["groupByClause"]
    >
);
export function mapInitial<
    QueryT extends AfterSelectClause & NonCorrelated & Unmapped,
    NxtReturnT
> (
    query : QueryT,
    mapDelegate : InitialMapDelegate<QueryT, NxtReturnT>
) : (
    MapInitial<QueryT, NxtReturnT>
) {
    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        //mapDelegate,
        groupByClause,
    } = query;

    const result : MapInitial<QueryT, NxtReturnT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate : mapDelegate as MapDelegate<never, never, NxtReturnT>,
            groupByClause,
        },
        query
    );
    return result;
}
