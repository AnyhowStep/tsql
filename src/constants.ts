/**
 * This string value `__aliased` was picked
 * as it is unlikely to be part of an identifier
 * in a database.
 *
 * -----
 *
 * This query,
 * ```sql
 * SELECT
 *  RAND() AS r
 * ```
 *
 * becomes,
 * ```sql
 * SELECT
 *  RAND() AS `__aliased--r`
 * ```
 *
 * -----
 *
 * This query,
 * ```sql
 * SELECT
 *  (SELECT x FROM myTable LIMIT 1) AS r
 * ```
 *
 * becomes,
 * ```sql
 * SELECT
 *  (SELECT x FROM myTable LIMIT 1) AS `__aliased--r`
 * ```
 */
export const ALIASED = "__aliased";

/**
 * This string value `--` was picked
 * as it is unlikely to be part of an identifier
 * in a database.
 *
 * -----
 *
 * This query,
 * ```sql
 * SELECT
 *  RAND() AS r
 * ```
 *
 * becomes,
 * ```sql
 * SELECT
 *  RAND() AS `__aliased--r`
 * ```
 *
 * -----
 *
 * This query,
 * ```sql
 * SELECT
 *  (SELECT x FROM myTable LIMIT 1) AS r
 * ```
 *
 * becomes,
 * ```sql
 * SELECT
 *  (SELECT x FROM myTable LIMIT 1) AS `__aliased--r`
 * ```
 */
export const SEPARATOR = "--";
