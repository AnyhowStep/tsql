import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * + MySQL      : `ACOS(1.5)` === `NULL`
 * + PostgreSQL : `ACOS(1.5)` throws error
 * + SQLite     : Implement with user-defined function
 */
export const acos = makeUnaryOperator<OperatorType.ARC_COSINE, number, number|null>(
    OperatorType.ARC_COSINE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
