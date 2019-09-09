import * as tm from "type-mapping";
import {OperatorType} from "../../../ast";
import {makeDoubleEliminationUnaryOperator} from "../../factory";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_not
 *
 * This version of the `NOT` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link not3}
 */
export const not = makeDoubleEliminationUnaryOperator<OperatorType.NOT, boolean, boolean>(
    OperatorType.NOT,
    tm.mysql.boolean()
);
