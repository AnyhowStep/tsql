import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `FLOOR(FLOOR(x)) == FLOOR(x)`
 */
export const floor = makeIdempotentUnaryOperator<OperatorType.FLOOR, number, number>(
    OperatorType.FLOOR,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
