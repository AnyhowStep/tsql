import {makeComparison3, Comparison3} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_between
 *
 * This version of the `BETWEEN ... AND` operator prevents `NULL`.
 *
 * For null-safe checks, @see {@link nullSafeBetween}
 *
 */
export const between : Comparison3 = makeComparison3(
    OperatorType.BETWEEN_AND
);
