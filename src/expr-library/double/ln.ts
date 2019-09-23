import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln = makeOperator1<OperatorType.LN, number, number|null>(
    OperatorType.LN,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
