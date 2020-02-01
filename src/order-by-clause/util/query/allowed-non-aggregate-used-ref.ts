import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {ColumnRefUtil, ColumnRef} from "../../../column-ref";
import {UsedRefUtil} from "../../../used-ref";
import {IJoin} from "../../../join";
import {GroupByClause} from "../../../group-by-clause";

export type AllowedNonAggregateColumnRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectClauseT extends SelectClause|undefined
> =
    ColumnRefUtil.Intersect<
        /**
         * We know these will never be aggregate expressions
         */
        ColumnRefUtil.ExtractColumnIdentifier<
            ColumnRefUtil.FromJoinArray<
                FromClauseT["currentJoins"] extends readonly IJoin[] ?
                FromClauseT["currentJoins"] :
                []
            >,
            GroupByClauseT[number]
        >,
        (
            SelectClauseT extends SelectClause ?
            /**
             * May possibly contain aggregate expressions,
             * if they are `$aliased`
             *
             * Non-aggregate expressions are not supposed to reference aggregate expressions.
             * However, you shouldn't be able to create an expression that references an aggregate...
             * and not have it become an aggregate expression, itself.
             *
             * So, we can just let non-aggregate expressions reference aggregate expressions.
             *
             * However, the types might be cleaner if we remove aggregate expressions...
             *
             * @todo Consider removing all `isAggregate : true` and `isAggregate : boolean` expressions?
             * But keep `isAggregate : false` expressions!
             */
            ColumnRefUtil.FromSelectClause<SelectClauseT> :
            {}
        )
    >
;

export type AllowedNonAggregateUsedRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectClauseT extends SelectClause|undefined
> =
    UsedRefUtil.FromColumnRef<AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT, SelectClauseT>>
;

export function allowedNonAggregateColumnRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    selectClause : SelectClauseT
) : (
    AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT, SelectClauseT>
) {
    const inner = ColumnRefUtil.extractColumnIdentifiers(
        ColumnRefUtil.fromJoinArray(
            fromClause.currentJoins == undefined ?
            [] :
            fromClause.currentJoins
        ),
        groupByClause
    );
    const selectClauseColumns = (
        selectClause == undefined ?
        {} :
        ColumnRefUtil.fromSelectClause(selectClause as Exclude<SelectClauseT, undefined>)
    );
    const result = ColumnRefUtil.intersect(
        inner,
        selectClauseColumns
    ) as ColumnRef as AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT, SelectClauseT>;
    return result;
}

export function allowedNonAggregateUsedRef<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    selectClause : SelectClauseT
) : (
    AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT, SelectClauseT>
) {
    const usedRef = UsedRefUtil.fromColumnRef(
        allowedNonAggregateColumnRef<FromClauseT, GroupByClauseT, SelectClauseT>(
            fromClause,
            groupByClause,
            selectClause
        )
    );
    return usedRef;
}
