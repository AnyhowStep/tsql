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
 *
 * @todo Make this a reserved `tableAlias`
 * No `ITable/IAliasedTable` should be able to have
 * a `tableAlias` value of `typeof ALIASED`.
 *
 * If such a thing were to happen,
 * it would make enforcing safe interactions between
 * `SELECT` and `FROM` clause very difficult/troublesome.
 *
 * But... What's the probability of someone using `__aliased`
 * as a table name?
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
