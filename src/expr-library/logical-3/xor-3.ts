import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
 *
 * This version of the `XOR` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link xor}
 */
export const xor3 = makeOperator2<OperatorType.XOR, boolean|null, boolean|null>(
    OperatorType.XOR,
    tm.mysql.boolean().orNull()
);
