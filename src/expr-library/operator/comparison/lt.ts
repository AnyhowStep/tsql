import {makeComparison, Comparison} from "./make-comparison";
import {OperatorType} from "../../../ast";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than
 *
 * This version of the `<` operator prevents `NULL`.
 *
 */
export const lt : Comparison = makeComparison(
    OperatorType.LESS_THAN
);
