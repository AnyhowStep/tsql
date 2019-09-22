import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `ROUND(ROUND(x)) == ROUND(x)`
 */
export const round = makeIdempotentUnaryOperator<OperatorType.ROUND, Decimal, Decimal>(
    OperatorType.ROUND,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
