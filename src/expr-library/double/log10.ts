import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LOG10(0)` === `NULL`
 * + PostgreSQL : `LOG(10, 0)` throws error
 */
export const log10 = makeUnaryOperator<OperatorType.LOG10, number, number|null>(
    OperatorType.LOG10,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
