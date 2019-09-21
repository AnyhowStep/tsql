import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `SQRT(-5)` === `null`
 * + PostgreSQL : `SQRT(-5)` throws error
 */
export const sqrt = makeUnaryOperator<OperatorType.SQUARE_ROOT, number, number|null>(
    OperatorType.SQUARE_ROOT,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
