import {IQuery} from "../../query";
import {IAliasedTable} from "../../../aliased-table";
import {ColumnIdentifierArrayUtil} from "../../../column-identifier";
import {CompileError} from "../../../compile-error";
import {IJoin} from "../../../join";
import {ColumnUtil} from "../../../column";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

type AllowedColumns<
    QueryT extends IQuery,
    AliasedTableT extends IAliasedTable
> = (
    /**
     * According to the SQL standard,
     * a derived table may reference columns from
     * parent queries
     */
    | (
        QueryT["_parentJoins"] extends readonly IJoin[] ?
        ColumnUtil.FromJoinArray<QueryT["_parentJoins"]> :
        never
    )
    /**
     * A lateral derived table may reference columns from
     * the same `FROM/JOIN` clause
     */
    | (
        AliasedTableT["lateral"] extends true ?
        (
            QueryT["_joins"] extends readonly IJoin[] ?
            ColumnUtil.FromJoinArray<QueryT["_joins"]> :
            never
        ) :
        never
    )
);
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
export type AssertValidUsedRef<
    QueryT extends IQuery,
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    Extract<keyof AliasedTableT["usedRef"], string> extends never ?
    //Having no `usedRef` is the best.
    TrueT :
    (
        (
            Exclude<
                ColumnUtil.FromColumnRef<AliasedTableT["usedRef"]>,
                AllowedColumns<QueryT, AliasedTableT>
            > extends never ?
            //All of `usedRef` is valid
            TrueT :
            CompileError<[
                "The following columns cannot be referenced",
                Exclude<
                    ColumnUtil.FromColumnRef<AliasedTableT["usedRef"]>,
                    AllowedColumns<QueryT, AliasedTableT>
                >,
                "Are the referenced tables in the parent query?",
                "Are the referenced tables in the same FROM/JOIN clause? Try a LATERAL derived table"
            ]>
        )
    )
);
export function assertValidUsedRef (
    query : IQuery,
    aliasedTable : IAliasedTable
) {
    if (Object.keys(aliasedTable.usedRef).length == 0) {
        //Having no `usedRef` is the best.
        return;
    }
    const used = ColumnIdentifierArrayUtil.fromColumnRef(aliasedTable.usedRef);
    const allowedFromParentQuery = (
        query._parentJoins == undefined ?
        {} :
        ColumnIdentifierRefUtil.fromJoinArray(query._parentJoins)
    );
    const allowedFromSameQuery = (
        aliasedTable.lateral ?
        (
            query._joins == undefined ?
            {} :
            ColumnIdentifierRefUtil.fromJoinArray(query._joins)
        ) :
        {}
    );
    ColumnIdentifierRefUtil.intersect(allowedFromParentQuery, allowedFromSameQuery);
    console.log(used);
    throw new Error(`not implemented`)
}
