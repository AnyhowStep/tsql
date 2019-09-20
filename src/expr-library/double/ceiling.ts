import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling = makeIdempotentUnaryOperator<OperatorType.CEILING, number, number>(
    OperatorType.CEILING,
    tm.mysql.double()
);
