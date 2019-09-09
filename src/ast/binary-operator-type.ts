/**
 * An abstraction over the different types of operators.
 *
 * This is useful for operators like,
 * + Null-safe equality
 *      + MySQL's operator is `<=>`
 *      + PostreSQL's operator is `IS NOT DISTINCT FROM`
 *      + SQLite's operator is `IS`
 * + XOR (boolean xor)
 *      + MySQL's operator is `XOR`
 *      + PostgreSQL's operator is `<>` (not-equal)
 *      + SQLite's operator is `<>` (not-equal)
 *
 * -----
 *
 * MySQL-specific:
 * + `MATCH`
 *   https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html#function_match
 * + `REGEXP`
 *   https://dev.mysql.com/doc/refman/8.0/en/regexp.html#operator_regexp
 *   https://dev.mysql.com/doc/refman/8.0/en/regexp.html#function_regexp-like
 *   https://dev.mysql.com/doc/refman/8.0/en/regexp.html#regexp-syntax
 *   http://userguide.icu-project.org/strings/regexp
 *   + TODO: Find out difference between POSIX regex and ICU regex
 * + `SOUNDS LIKE`
 *   https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#operator_sounds-like
 *
 * -----
 *
 * PostgreSQL-specific:
 * + `SIMILAR TO`
 *   https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP
 * + `~`/`~*`/`!~`/`!~*`
 *   https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-POSIX-REGEXP
 *   + TODO: Find out difference between POSIX regex and ICU regex
 */
export enum BinaryOperatorType {

}
