import {makeComparison, Comparison} from "../../factory";
import {OperatorType} from "../../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than
 *
 * This version of the `<` operator prevents `NULL`.
 *
 */
export const lt : Comparison = makeComparison(
    OperatorType.LESS_THAN
);
