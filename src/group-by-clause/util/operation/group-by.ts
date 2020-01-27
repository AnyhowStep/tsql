import {FromClauseUtil} from "../../../from-clause";
import {allowedColumnIdentifierRef, AllowedColumnIdentifierRef} from "../query";
import {GroupByClause} from "../../group-by-clause";
import {GroupByDelegate} from "../../group-by-delegate";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierUtil} from "../../../column-identifier";

export type GroupBy<
    GroupByClauseT extends GroupByClause|undefined,
    GroupByT extends GroupByClause
> =
    GroupByClauseT extends GroupByClause ?
    readonly (
        | GroupByClauseT[number]
        | GroupByT[number]
    )[] :
    readonly (
        GroupByT[number]
    )[]
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
    GroupByClauseT extends GroupByClause|undefined,
    GroupByT extends readonly ColumnIdentifierUtil.FromColumnRef<
        AllowedColumnIdentifierRef<FromClauseT>
    >[]
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    groupByDelegate : GroupByDelegate<FromClauseT, GroupByT>
) : (
    GroupBy<GroupByClauseT, GroupByT>
) {
    FromClauseUtil.assertAfterFromClause(fromClause);

    const columns = allowedColumnIdentifierRef(fromClause);
    const groupBy = groupByDelegate(ColumnIdentifierRefUtil.tryFlatten(
        columns
    ));

    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        columns,
        groupBy
    );

    return (
        groupByClause == undefined ?
        groupBy as readonly (
            GroupByT[number]
        )[] :
        [...(groupByClause as Exclude<GroupByClauseT, undefined>), ...groupBy] as readonly (
            | Exclude<GroupByClauseT, undefined>[number]
            | GroupByT[number]
        )[]
    ) as GroupBy<GroupByClauseT, GroupByT>;
}
