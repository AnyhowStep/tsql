import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling = makeOperator1Idempotent<OperatorType.CEILING, Decimal, Decimal>(
    OperatorType.CEILING,
    decimalMapper,
    TypeHint.DECIMAL
);
