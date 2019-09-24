import {makeComparison2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than-or-equal
 *
 * This version of the `<=` operator prevents `NULL`.
 *
 */
export const ltEq = makeComparison2(
    OperatorType.LESS_THAN_OR_EQUAL
);
