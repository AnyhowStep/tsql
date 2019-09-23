import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
 *
 * Will return -1, 0, 1
 */
export const sign = makeOperator1Idempotent<OperatorType.SIGN, bigint, bigint>(
    OperatorType.SIGN,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT
);
