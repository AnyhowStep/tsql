import {IFromClause, FromClauseUtil} from "../../../from-clause";
import {GroupByClause} from "../../../group-by-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {UsedRefUtil} from "../../../used-ref";

export type AllowedNonAggregateColumnRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> =
    ColumnRefUtil.ExtractColumnIdentifier<
        FromClauseUtil.AllowedColumnRef<FromClauseT, { isLateral : true }>,
        GroupByClauseT[number]
    >
;

export type AllowedNonAggregateUsedRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> =
    UsedRefUtil.ExtractColumnIdentifier<
        FromClauseUtil.AllowedUsedRef<FromClauseT, { isLateral : true }>,
        GroupByClauseT[number]
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
    return ColumnRefUtil.extractColumnIdentifiers<
        FromClauseUtil.AllowedColumnRef<FromClauseT, { isLateral : true }>,
        GroupByClauseT[number]
    >(
        FromClauseUtil.allowedColumnRef(fromClause, { isLateral : true }),
        groupByClause
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
    return UsedRefUtil.extractColumnIdentifiers<
        FromClauseUtil.AllowedUsedRef<FromClauseT, { isLateral : true }>,
        GroupByClauseT[number]
    >(
        FromClauseUtil.allowedUsedRef(fromClause, { isLateral : true }),
        groupByClause
    );
}
