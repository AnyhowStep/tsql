import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LOG2(0)` === `NULL`
 * + PostgreSQL : `LOG(2, 0)` throws error
 */
export const log2 = makeUnaryOperator<OperatorType.LOG2, number, number|null>(
    OperatorType.LOG2,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
