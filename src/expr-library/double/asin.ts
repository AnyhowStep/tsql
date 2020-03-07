import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the arc sine.
 *
 * If the argument is not in [-1, 1], may throw, or return `null`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_asin
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `ASIN(x)`
 * + PostgreSQL     : `ASIN(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * + MySQL      : `ASIN(1.5)` === `NULL`
 * + PostgreSQL : `ASIN(1.5)` throws error
 */
export const asin : Operator1<number, number|null> = makeOperator1<OperatorType.ARC_SINE, number, number|null>(
    OperatorType.ARC_SINE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
