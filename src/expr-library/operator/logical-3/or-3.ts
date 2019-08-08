import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_or
 *
 * This version of the `OR` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link or}
 */
export const or3 : ChainableOperator<boolean|null> = makeChainableOperator<boolean|null>(
    "OR",
    false,
    tm.mysql.boolean().orNull()
);
