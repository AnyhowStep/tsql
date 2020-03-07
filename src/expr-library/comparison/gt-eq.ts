import {makeComparison2, Comparison2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_greater-than-or-equal
 *
 * This version of the `>=` operator prevents `NULL`.
 *
 */
export const gtEq : Comparison2 = makeComparison2(
    OperatorType.GREATER_THAN_OR_EQUAL
);
