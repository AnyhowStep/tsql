import {decimalMapper} from "./decimal-mapper";
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
    decimalMapper,
    TypeHint.DECIMAL
);
