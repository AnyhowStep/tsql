import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeIdempotentUnaryOperator} from "../factory";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

/**
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 */
export const abs = makeIdempotentUnaryOperator<OperatorType.ABSOLUTE_VALUE, Decimal, Decimal>(
    OperatorType.ABSOLUTE_VALUE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
