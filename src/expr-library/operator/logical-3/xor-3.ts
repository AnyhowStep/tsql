import * as tm from "type-mapping";
import {BinaryOperator, makeBinaryOperator} from "../make-binary-operator";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
 *
 * This version of the `XOR` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link xor}
 */
export const xor3 : BinaryOperator<boolean|null, boolean|null> = makeBinaryOperator(
    "XOR",
    tm.mysql.boolean().orNull()
);
