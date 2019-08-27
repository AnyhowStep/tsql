import {FromClauseUtil} from "../../../from-clause";
import {allowedColumnIdentifierRef} from "../query";
import {SelectClause} from "../../../select-clause";
import {GroupByClause} from "../../group-by-clause";
import {GroupByDelegate} from "../../group-by-delegate";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

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
        [...groupByClause, ...groupBy]
    );
}
