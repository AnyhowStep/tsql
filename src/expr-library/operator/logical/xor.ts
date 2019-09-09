import * as tm from "type-mapping";
import {BinaryOperator, makeBinaryOperator} from "../../factory";
import {OperatorType} from "../../../ast";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
 *
 * This version of the `XOR` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link xor3}
 */
export const xor : BinaryOperator<boolean, boolean> = makeBinaryOperator(
    OperatorType.XOR,
    tm.mysql.boolean()
);
