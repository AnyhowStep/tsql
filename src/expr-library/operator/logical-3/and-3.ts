import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_and
 *
 * This version of the `AND` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link and}
 */
export const and3 : ChainableOperator<boolean|null> = makeChainableOperator<boolean|null>(
    "AND",
    true,
    tm.mysql.boolean().orNull()
);
