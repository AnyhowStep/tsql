import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * + MySQL      : `LOG(0, 0)` === `NULL`
 * + PostgreSQL : `LOG(0, 0)` throws error
 * + MySQL      : `LOG(1, 5)` === `NULL`
 * + PostgreSQL : `LOG(1, 5)` throws error
 */
export const log = makeOperator2<OperatorType.LOG, number, number|null>(
    OperatorType.LOG,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
