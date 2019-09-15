import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_or
 *
 * This version of the `OR` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link or3}
 */
export const or : ChainableOperator<boolean> = makeChainableOperator<OperatorType.AND, boolean>(
    OperatorType.AND,
    false,
    tm.mysql.boolean()
);
