import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../../factory";
import {OperatorType} from "../../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_and
 *
 * This version of the `AND` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link and3}
 */
export const and : ChainableOperator<boolean> = makeChainableOperator<OperatorType.AND, boolean>(
    OperatorType.AND,
    true,
    tm.mysql.boolean()
);
