import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1Idempotent, Operator1} from "../factory";

/**
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling : Operator1<Decimal, Decimal> = makeOperator1Idempotent<OperatorType.CEILING, Decimal, Decimal>(
    OperatorType.CEILING,
    decimalMapper,
    TypeHint.DECIMAL
);
