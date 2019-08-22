import {CompileError} from "../../../compile-error";
import {UsedRefUtil} from "../../../used-ref";
import {IFromClause, FromClauseUtil} from "../../../from-clause";
import {RawExpr, RawExprUtil} from "../../../raw-expr";

/**
 * Problem: `ON` clause cannot reference outer query tables
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      outerQueryTable
 *  WHERE
 *      --This is a subquery
 *      EXISTS (
 *          SELECT
 *              *
 *          FROM
 *              myTable
 *          INNER JOIN
 *              otherTable
 *          ON
 *              --This `ON` clause references `outerQueryTable.outerQueryColumn`
 *              outerQueryTable.outerQueryColumn IS NOT NULL
 *      )
 * ```
 *
 * + In MySQL 8.0, you cannot
 * + In MySQL 5.7, you cannot
 * + This is not a restriction of the SQL standard. Just a MySQL limitation.
 * + In PostgreSQL 9.4 you can
 * + In SQLite 3.26 you can
 *
 * Solution: Rewrite the query
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      outerQueryTable
 *  WHERE
 *      --This is a subquery
 *      EXISTS (
 *          SELECT
 *              *
 *          FROM
 *              myTable
 *          INNER JOIN
 *              otherTable
 *          WHERE
 *              --This `WHERE` clause references `outerQueryTable.outerQueryColumn`
 *              outerQueryTable.outerQueryColumn IS NOT NULL
 *      )
 * ```
 *
 */
export type AssertNoOuterQueryUsedRef<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">,
    RawOnClauseT extends RawExpr<boolean>
> = (
    Extract<
        UsedRefUtil.TableAlias<RawExprUtil.UsedRef<RawOnClauseT>>,
        FromClauseUtil.OuterQueryTableAlias<FromClauseT>
    > extends never ?
    unknown :
    CompileError<[
        "ON clause must not reference outer query tables",
        Extract<
            UsedRefUtil.TableAlias<RawExprUtil.UsedRef<RawOnClauseT>>,
            FromClauseUtil.OuterQueryTableAlias<FromClauseT>
        >
    ]>
);
export function assertNoOuterQueryUsedRef (
    fromClause : Pick<IFromClause, "outerQueryJoins">,
    rawOnClause : RawExpr<boolean>
) {
    const outerQueryTableAliases : string[] = FromClauseUtil.outerQueryTableAlias(fromClause);
    const usedOuterQueryTableAliases = Object.keys(RawExprUtil.usedRef(rawOnClause).columns)
        .filter(usedTableAlias => {
            return outerQueryTableAliases.includes(usedTableAlias);
        });
    if (usedOuterQueryTableAliases.length > 0) {
        throw new Error(`ON clause must not reference outer query tables ${usedOuterQueryTableAliases.join(",")}`);
    }
}
