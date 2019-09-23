import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `LOG10(0)` === `NULL`
 * + PostgreSQL : `LOG(10, 0)` throws error
 */
export const log10 = makeOperator1<OperatorType.LOG10, number, number|null>(
    OperatorType.LOG10,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
