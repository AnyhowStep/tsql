import {IAliasedTable} from "../../../aliased-table";
import {CompileError} from "../../../compile-error";
import {UsedRefUtil} from "../../../used-ref";

/**
 * Problem: Derived tables cannot reference same `FROM/JOIN` clause tables
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      sameFromClauseTable
 *  JOIN
 *      --This derived table references `sameFromClauseTable.sameFromClauseColumn`
 *      (
 *          SELECT
 *              *
 *          FROM
 *              innerTable
 *          WHERE
 *              --This expression references `sameFromClauseTable.sameFromClauseColumn`
 *              sameFromClauseTable.sameFromClauseColumn > innerTable.innerColumn
 *      ) AS derivedTable
 * ```
 *
 * + This is not allowed in MySQL 5.7
 * + This is not allowed in MySQL 8.0
 * + This can work with `LATERAL` in MySQL 8.0
 *
 * Solution: Rewrite the query
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      sameFromClauseTable
 *  JOIN
 *      innerTable
 *  WHERE
 *      sameFromClauseTable.sameFromClauseColumn > innerTable.innerColumn
 * ```
 *
 * @todo Implement `LATERAL`
 *
 * With `LATERAL`, you should be able to write,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      sameFromClauseTable
 *  JOIN
 *      --This lateral derived table references `sameFromClauseTable.sameFromClauseColumn`
 *      LATERAL (
 *          SELECT
 *              *
 *          FROM
 *              innerTable
 *          WHERE
 *              --This expression references `sameFromClauseTable.sameFromClauseColumn`
 *              sameFromClauseTable.sameFromClauseColumn > innerTable.innerColumn
 *      ) AS derivedTable
 * ```
 *
 * -----
 *
 * Problem: Derived tables cannot reference outer query tables
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
 *              --This derived table references `outerQueryTable.outerQueryColumn`
 *              (
 *                  SELECT
 *                      *
 *                  FROM
 *                      innerTable
 *                  WHERE
 *                      --This expression references `outerQueryTable.outerQueryColumn`
 *                      outerQueryTable.outerQueryColumn > innerTable.innerColumn
 *              ) AS derivedTable
 *      )
 * ```
 *
 * + In MySQL 8.0, you can reference outer query tables
 * + In MySQL 5.7, you cannot
 * + This is not a restriction of the SQL standard. Just a MySQL limitation.
 *
 * Solution: Rewrite the query
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      outerQueryTable
 *  WHERE
 *      EXISTS (
 *          SELECT
 *              *
 *          FROM
 *              innerTable
 *          WHERE
 *              --This expression references `outerQueryTable.outerQueryColumn`
 *              outerQueryTable.outerQueryColumn > innerTable.innerColumn
 *      )
 * ```
 *
 */
export type AssertNoUsedRef<
    AliasedTableT extends Pick<IAliasedTable, "alias"|"usedRef">
> = (
    UsedRefUtil.TableAlias<AliasedTableT["usedRef"]> extends never ?
    unknown :
    CompileError<[
        "Derived table",
        AliasedTableT["alias"],
        "must not reference outer query tables or tables in the same FROM/JOIN clause",
        UsedRefUtil.TableAlias<AliasedTableT["usedRef"]>
    ]>
);
export function assertNoUsedRef (
    aliasedTable : Pick<IAliasedTable, "alias"|"usedRef">
) {
    if (Object.keys(aliasedTable.usedRef.columns).length > 0) {
        throw new Error(`Derived table ${aliasedTable.alias} must not reference outer query tables or tables in the same FROM/JOIN clause`);
    }
}
