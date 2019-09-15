import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_and
 *
 * This version of the `AND` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link and}
 */
export const and3 : ChainableOperator<boolean|null> = makeChainableOperator<OperatorType.AND, boolean|null>(
    OperatorType.AND,
    true,
    tm.mysql.boolean().orNull()
);
