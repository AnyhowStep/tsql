import * as tm from "type-mapping";
import {BinaryOperator, makeBinaryOperator} from "../../factory";
import {OperatorType} from "../../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
 *
 * This version of the `XOR` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link xor}
 */
export const xor3 : BinaryOperator<boolean|null, boolean|null> = makeBinaryOperator(
    OperatorType.XOR,
    tm.mysql.boolean().orNull()
);
