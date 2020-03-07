import {makeEquation2, Equation2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal
 *
 * This version of the `=` operator prevents `NULL`.
 *
 * For null-safe equality, @see {@link nullSafeEq}
 */
export const eq : Equation2 = makeEquation2(
    OperatorType.EQUAL
);
