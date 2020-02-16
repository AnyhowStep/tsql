import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the arc cosine.
 *
 * If the argument is not in [-1, 1], may throw, or return `null`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_acos
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `ACOS(x)`
 * + PostgreSQL     : `ACOS(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * + MySQL      : `ACOS(1.5)` === `NULL`
 * + PostgreSQL : `ACOS(1.5)` throws error
 */
export const acos = makeOperator1<OperatorType.ARC_COSINE, number, number|null>(
    OperatorType.ARC_COSINE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
