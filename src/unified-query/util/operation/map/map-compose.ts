import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {MapDelegate, MapDelegateUtil} from "../../../../map-delegate";
import {ExecutionUtil} from "../../../../execution";
import {AfterSelectClause, NonCorrelated, Mapped} from "../../helper-type";
import {TypeOfAwait} from "../../../../type-util";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type MapComposeImpl<
    NewMapDelegateT extends MapDelegate,
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : NewMapDelegateT,
    }>
);
export type MapCompose<
    QueryT extends AfterSelectClause & NonCorrelated & Mapped,
    NxtReturnT
> = (
    MapComposeImpl<
        MapDelegateUtil.Compose<
            ExecutionUtil.UnmappedRow<QueryT>,
            NxtReturnT
        >,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export type ComposedMapDelegate<
    QueryT extends AfterSelectClause & NonCorrelated & Mapped,
    NxtReturnT
> =
    MapDelegate<
        TypeOfAwait<ReturnType<QueryT["mapDelegate"]>>,
        ExecutionUtil.UnmappedRow<QueryT>,
        NxtReturnT
    >
;
export function mapCompose<
    QueryT extends AfterSelectClause & NonCorrelated & Mapped,
    NxtReturnT
> (
    query : QueryT,
    mapDelegate : ComposedMapDelegate<QueryT, NxtReturnT>
) : (
    MapCompose<QueryT, NxtReturnT>
) {
    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        //mapDelegate,
    } = query;

    const result : MapCompose<QueryT, NxtReturnT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate : (
                MapDelegateUtil.compose<
                    ExecutionUtil.UnmappedRow<QueryT>,
                    ReturnType<QueryT["mapDelegate"]>,
                    NxtReturnT
                >(
                    /**
                     * @todo Clean up?
                     */
                    query.mapDelegate as unknown as (
                        MapDelegate<
                            ExecutionUtil.UnmappedRow<QueryT>,
                            ExecutionUtil.UnmappedRow<QueryT>,
                            ReturnType<QueryT["mapDelegate"]>
                        >
                    ),
                    mapDelegate
                )
            ),
        },
        query
    );
    return result;
}
