import {makeComparison2, Comparison2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than
 *
 * This version of the `<` operator prevents `NULL`.
 *
 */
export const lt : Comparison2 = makeComparison2(
    OperatorType.LESS_THAN
);
