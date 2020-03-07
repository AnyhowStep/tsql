import {makeEquation2, Equation2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-equal
 *
 * This version of the `<>` operator prevents `NULL`.
 *
 * For null-safe inequality, @see {@link nullSafeNotEq}
 *
 */
export const notEq : Equation2 = makeEquation2(
    OperatorType.NOT_EQUAL
);
