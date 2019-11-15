import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `ROUND(ROUND(x)) == ROUND(x)`
 */
export const round = makeOperator1Idempotent<OperatorType.ROUND, Decimal, Decimal>(
    OperatorType.ROUND,
    decimalMapper,
    TypeHint.DECIMAL
);
