import {makeComparison, Comparison} from "./make-comparison";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than-or-equal
 *
 * This version of the `<=` operator prevents `NULL`.
 *
 */
export const ltEq : Comparison = makeComparison(
    "<="
);
