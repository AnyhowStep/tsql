import {makeNullSafeUnaryComparison, NullSafeUnaryComparison} from "./make-null-safe-unary-comparison";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not-null
 *
 * Tests whether a value is not `NULL`.
 *
 * ```sql
 * mysql> SELECT (1 IS NOT NULL), (0 IS NOT NULL), (NULL IS NOT NULL);
 *         -> 1, 1, 0
 * ```
 */
export const isNotNull : NullSafeUnaryComparison = makeNullSafeUnaryComparison(
    "IS NOT NULL"
);
