import {IFromClause, FromClauseUtil} from "../../../from-clause";

/**
 * For now, this is basically the same as `WhereClauseUtil.AllowedColumnRef<>`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 *
 * -----
 *
 * The following is valid for MySQL and SQLite,
 * but not for PostgreSQL,
 *
 * ```sql
 *  SELECT
 *      myTable.myColumn+2 AS someAlias
 *  FROM
 *      myTable
 *  GROUP BY
 *      someAlias
 *  HAVING
 *      someAlias > 0
 * ```
 */
export type AllowedColumnRef<
    FromClauseT extends IFromClause
> = (
    FromClauseUtil.AllowedColumnRef<FromClauseT, { isLateral : true }>
);
/**
 * For now, this is basically the same as `WhereClauseUtil.AllowedUsedRef<>`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 */
export type AllowedUsedRef<
    FromClauseT extends IFromClause
> = (
    FromClauseUtil.AllowedUsedRef<FromClauseT, { isLateral : true }>
);
/**
 * For now, this is basically the same as `WhereClauseUtil.AllowedColumnRef<>`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 */
export function allowedColumnRef<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    AllowedColumnRef<FromClauseT>
) {
    return FromClauseUtil.allowedColumnRef(fromClause, { isLateral : true });
}

/**
 * For now, this is basically the same as `WhereClauseUtil.AllowedUsedRef<>`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 */
export function allowedUsedRef<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    AllowedUsedRef<FromClauseT>
) {
    return FromClauseUtil.allowedUsedRef(fromClause, { isLateral : true });
}
