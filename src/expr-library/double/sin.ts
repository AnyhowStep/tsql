import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Returns the sine
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sin
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `SIN(x)`
 * + PostgreSQL     : `SIN(x)`
 * + SQLite         : None, implement with user-defined function
 *   + `extension-functions.c` from https://www.sqlite.org/contrib returns `null` for `SIN(1e999)`
 *
 * -----
 *
 * @param arg - Radians
 * @returns The sine
 */
export const sin = makeOperator1<OperatorType.SINE, number, number|null>(
    OperatorType.SINE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
