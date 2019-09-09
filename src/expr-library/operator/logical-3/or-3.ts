import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../../factory";
import {OperatorType} from "../../../ast";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_or
 *
 * This version of the `OR` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link or}
 */
export const or3 : ChainableOperator<boolean|null> = makeChainableOperator<OperatorType.OR, boolean|null>(
    OperatorType.OR,
    false,
    tm.mysql.boolean().orNull()
);
