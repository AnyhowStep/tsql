import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `FLOOR(FLOOR(x)) == FLOOR(x)`
 */
export const floor = makeOperator1Idempotent<OperatorType.FLOOR, Decimal, Decimal>(
    OperatorType.FLOOR,
    decimalMapper,
    TypeHint.DECIMAL
);
