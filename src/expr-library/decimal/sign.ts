import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent, Operator1} from "../factory";

/**
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
 */
export const sign : Operator1<Decimal, Decimal> = makeOperator1Idempotent<OperatorType.SIGN, Decimal, Decimal>(
    OperatorType.SIGN,
    decimalMapper,
    TypeHint.DECIMAL
);
