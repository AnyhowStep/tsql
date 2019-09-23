import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `COT(0)` throws error
 * + PostgreSQL : `COT(0)` === `NULL`
 */
export const cot = makeOperator1<OperatorType.COTANGENT, number, number|null>(
    OperatorType.COTANGENT,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
