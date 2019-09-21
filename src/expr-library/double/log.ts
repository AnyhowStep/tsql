import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

/**
 * + MySQL      : `LOG(0, 0)` === `NULL`
 * + PostgreSQL : `LOG(0, 0)` throws error
 */
export const log = makeBinaryOperator<OperatorType.LOG, number, number|null>(
    OperatorType.LOG,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
