import * as tm from "type-mapping";
import {OperatorType} from "../../../ast";
import {makeIdempotentUnaryOperator} from "../../factory";

/**
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 */
export const abs = makeIdempotentUnaryOperator<OperatorType.ABSOLUTE_VALUE, number, number>(
    OperatorType.ABSOLUTE_VALUE,
    tm.mysql.double()
);
