import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import * as HavingClauseUtil from "./util";
import {ColumnUtil} from "../column";
import {GroupByClause, GroupByClauseUtil} from "../group-by-clause";
import {Identity} from "../type-util";

export type AllowedHavingClause<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> =
    Identity<
        | boolean
        | IExpr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : HavingClauseUtil.AllowedUsedRef<FromClauseT>,
            isAggregate : true,
        }>
        /**
         * If `isAggregate` is `false` or `boolean`, we treat it
         * as a non-aggregate expression.
         *
         * Non-aggregate expressions have more restrictions
         * on what can be referenced.
         */
        | IExpr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : HavingClauseUtil.AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>,
            isAggregate : boolean,
        }>
        /**
         * Columns are non-aggregate expressions
         */
        | ColumnUtil.ExtractWithType<
            ColumnUtil.FromColumnRef<
                HavingClauseUtil.AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT>
            >,
            boolean
        >
    >
;

/**
 * SQLite requires a non-empty `GROUP BY` clause before the `HAVING` clause.
 */
export type HavingDelegate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            HavingClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => (
        & AllowedHavingClause<
            FromClauseT,
            GroupByClauseT
        >
        & GroupByClauseUtil.AssertNonEmpty<GroupByClauseT>
    )
);
