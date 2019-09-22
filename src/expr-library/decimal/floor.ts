import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `FLOOR(FLOOR(x)) == FLOOR(x)`
 */
export const floor = makeIdempotentUnaryOperator<OperatorType.FLOOR, Decimal, Decimal>(
    OperatorType.FLOOR,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
