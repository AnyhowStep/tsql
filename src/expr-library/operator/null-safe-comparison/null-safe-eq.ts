//import {makeNullSafeComparison, NullSafeComparison} from "./make-null-safe-comparison";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal-to
 *
 * This operator allows `NULL`.
 *
 * This operator performs an equality comparison like the `=` operator,
 * but returns
 * + `1` rather than `NULL` if both operands are `NULL`, and
 * + `0` rather than `NULL` if one operand is `NULL`.
 *
 * For regular equality, @see {@link eq}
 *
 * -----
 *
 * `tsql` does not provide a null-safe equality operator because
 * different databases implement it differently.
 *
 * Database   | Operator
 * -----------|-----------------------
 * PostgreSQL | `IS NOT DISTINCT FROM`
 * MySQL      | `<=>` (>= 5.5 ?)
 * MariaDB    | `<=>`
 * SQLite     | `IS`
 * H2         | `IS`
 */
/*
export const nullSafeEq : NullSafeComparison = makeNullSafeComparison(
    "<=>"
);
*/
