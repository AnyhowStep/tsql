import {makeComparison, Comparison} from "./make-comparison";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-equal
 *
 * This version of the `<>` operator prevents `NULL`.
 *
 * For null-safe inequality, @see {@link nullSafeNotEq}
 *
 */
export const notEq : Comparison = makeComparison(
    "<>"
);
