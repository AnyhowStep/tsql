import {IFromClause} from "../../../from-clause";
import {GroupByClause} from "../../../group-by-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {UsedRefUtil} from "../../../used-ref";
import {IJoin} from "../../../join";
import {Merge} from "../../../type-util";

export type AllowedNonAggregateColumnRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> =
    Merge<
        & ColumnRefUtil.FromJoinArray<
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            FromClauseT["outerQueryJoins"] :
            []
        >
        & ColumnRefUtil.ExtractColumnIdentifier<
            ColumnRefUtil.FromJoinArray<
                FromClauseT["currentJoins"] extends readonly IJoin[] ?
                FromClauseT["currentJoins"] :
                []
            >,
            GroupByClauseT[number]
        >
    >
;

export type AllowedNonAggregateUsedRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> =
    UsedRefUtil.FromColumnRef<
        AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT>
    >
;

export function allowedNonAggregateColumnRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT
) : (
    AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT>
) {
    const outer = ColumnRefUtil.fromJoinArray(
        fromClause.outerQueryJoins == undefined ?
        [] :
        fromClause.outerQueryJoins
    );
    const inner = ColumnRefUtil.extractColumnIdentifiers(
        ColumnRefUtil.fromJoinArray(
            fromClause.currentJoins == undefined ?
            [] :
            fromClause.currentJoins
        ),
        groupByClause
    );
    return ColumnRefUtil.intersect(outer, inner) as (
        AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT>
    );
}


export function allowedNonAggregateUsedRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT
) : (
    AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>
) {
    return UsedRefUtil.fromColumnRef(
        allowedNonAggregateColumnRef(fromClause, groupByClause)
    );
}
