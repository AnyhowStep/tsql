import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln = makeUnaryOperator<OperatorType.LN, number, number|null>(
    OperatorType.LN,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
