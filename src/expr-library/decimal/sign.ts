import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
 */
export const sign = makeOperator1Idempotent<OperatorType.SIGN, Decimal, Decimal>(
    OperatorType.SIGN,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
