import {FromClauseUtil} from "../../../from-clause";
import {allowedColumnIdentifierRef, AllowedColumnIdentifierRef} from "../query";
import {SelectClause} from "../../../select-clause";
import {GroupByClause} from "../../group-by-clause";
import {GroupByDelegate} from "../../group-by-delegate";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {Concat} from "../../../tuple-util";

/**
 * This will be more important when proper SQL `GROUP BY` behaviour
 * is supported.
 */
export type GroupBy<
    GroupByClauseT extends GroupByClause|undefined,
    GroupByT extends GroupByClause
> =
    GroupByClauseT extends GroupByClause ?
    Concat<
        GroupByClauseT,
        GroupByT
    > :
    GroupByT
;

/**
 * Returns the MySQL equivalent of `...groupByClause, ...groupByDelegate(columns)`
 *
 * -----
 *
 * Consider the following,
 * ```sql
 *  SELECT 1 AS a GROUP BY a
 * ```
 *
 * + The above works on PostgreSQL 9.4
 * + The above **does not** work on MySQL 5.7
 * -----
 *
 * We only allow `GROUP BY` after the `FROM` clause because
 * it isn't very useful without a `FROM` clause.
 *
 * @param fromClause
 * @param selectClause
 * @param groupByClause
 * @param groupByDelegate
 */
export function groupBy<
    /**
     * For MySQL 5.7,
     * the constraint **must** be `FromClauseUtil.AfterFromClause`
     */
    FromClauseT extends FromClauseUtil.AfterFromClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    groupByClause : GroupByClause|undefined,
    groupByDelegate : GroupByDelegate<FromClauseT, SelectClauseT>
) : (
    GroupByClause
);
export function groupBy<
    /**
     * For MySQL 5.7,
     * the constraint **must** be `FromClauseUtil.AfterFromClause`
     */
    FromClauseT extends FromClauseUtil.AfterFromClause,
    SelectClauseT extends SelectClause|undefined,
    GroupByClauseT extends GroupByClause|undefined,
    GroupByT extends ColumnIdentifierUtil.FromColumnRef<
        AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
    >[]
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    groupByClause : GroupByClauseT,
    groupByDelegate : GroupByDelegate<FromClauseT, SelectClauseT, GroupByT>
) : (
    GroupByClause
);
export function groupBy<
    /**
     * For MySQL 5.7,
     * the constraint **must** be `FromClauseUtil.AfterFromClause`
     */
    FromClauseT extends FromClauseUtil.AfterFromClause,
    SelectClauseT extends SelectClause|undefined,
    GroupByClauseT extends GroupByClause|undefined,
    GroupByT extends ColumnIdentifierUtil.FromColumnRef<
        AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
    >[]
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    groupByClause : GroupByClauseT,
    groupByDelegate : GroupByDelegate<FromClauseT, SelectClauseT, GroupByT>
) : (
    GroupByClause
) {
    FromClauseUtil.assertAfterFromClause(fromClause);

    const columns = allowedColumnIdentifierRef(fromClause, selectClause);
    const groupBy = groupByDelegate(ColumnIdentifierRefUtil.tryFlatten(
        columns
    ));

    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        columns,
        groupBy
    );

    return (
        groupByClause == undefined ?
        groupBy :
        [...(groupByClause as Exclude<GroupByClauseT, undefined>), ...groupBy]
    );
}
