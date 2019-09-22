import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling = makeIdempotentUnaryOperator<OperatorType.CEILING, Decimal, Decimal>(
    OperatorType.CEILING,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
