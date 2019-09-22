import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
 *
 * Will return -1, 0, 1
 */
export const sign = makeIdempotentUnaryOperator<OperatorType.SIGN, bigint, bigint>(
    OperatorType.SIGN,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT
);
