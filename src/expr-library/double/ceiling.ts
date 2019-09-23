import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1Idempotent} from "../factory";

/**
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling = makeOperator1Idempotent<OperatorType.CEILING, number, number>(
    OperatorType.CEILING,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
