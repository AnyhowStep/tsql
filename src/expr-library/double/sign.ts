import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
 */
export const sign = makeIdempotentUnaryOperator<OperatorType.SIGN, number, number>(
    OperatorType.SIGN,
    tm.mysql.double()
);
