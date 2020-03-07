import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
 *
 * This version of the `XOR` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link xor3}
 */
export const xor : Operator2<boolean, boolean, boolean> = makeOperator2<OperatorType.XOR, boolean, boolean>(
    OperatorType.XOR,
    tm.mysql.boolean()
);
