import {IAliasedTable} from "../../../aliased-table";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {CompileError} from "../../../compile-error";
import {Writable} from "../../../type-util";

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
 * Problem: Derived tables cannot reference parent query tables
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      parentQueryTable
 *  WHERE
 *      --This is a subquery
 *      EXISTS (
 *          SELECT
 *              *
 *          FROM
 *              --This derived table references `parentQueryTable.parentQueryColumn`
 *              (
 *                  SELECT
 *                      *
 *                  FROM
 *                      innerTable
 *                  WHERE
 *                      --This expression references `parentQueryTable.parentQueryColumn`
 *                      parentQueryTable.parentQueryColumn > innerTable.innerColumn
 *              ) AS derivedTable
 *      )
 * ```
 *
 * + In MySQL 8.0, you can reference parent query tables
 * + In MySQL 5.7, you cannot
 * + This is not a restriction of the SQL standard. Just a MySQL limitation.
 *
 * Solution: Rewrite the query
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      parentQueryTable
 *  WHERE
 *      EXISTS (
 *          SELECT
 *              *
 *          FROM
 *              innerTable
 *          WHERE
 *              --This expression references `parentQueryTable.parentQueryColumn`
 *              parentQueryTable.parentQueryColumn > innerTable.innerColumn
 *      )
 * ```
 *
 */
export type AssertNoUsedRef<
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    Extract<keyof AliasedTableT["usedRef"], string> extends never ?
    TrueT :
    CompileError<[
        "Derived table",
        AliasedTableT["tableAlias"],
        "must not reference parent query tables or tables in the same FROM/JOIN clause",
        Writable<
            ColumnIdentifierUtil.FromColumnRef<AliasedTableT["usedRef"]>
        >
    ]>
);
export function assertNoUsedRef (
    aliasedTable : IAliasedTable
) {
    if (Object.keys(aliasedTable.usedRef).length > 0) {
        throw new Error(`Derived table ${aliasedTable.tableAlias} must not reference parent query tables or tables in the same FROM/JOIN clause`);
    }
}
