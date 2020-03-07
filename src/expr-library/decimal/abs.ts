import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {makeOperator1Idempotent, Operator1} from "../factory";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

/**
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 */
export const abs : Operator1<Decimal, Decimal> = makeOperator1Idempotent<OperatorType.ABSOLUTE_VALUE, Decimal, Decimal>(
    OperatorType.ABSOLUTE_VALUE,
    decimalMapper,
    TypeHint.DECIMAL
);
