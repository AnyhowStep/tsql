import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns a random floating point number in the range, `[0.0, 1.0)`
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_rand
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
 * + https://www.sqlite.org/lang_corefunc.html#random
 *
 * -----
 *
 * + MySQL          : `RAND()`      Returns `0.0 <= v < 1.0`
 * + PostgreSQL     : `RANDOM()`    Returns `0.0 <= v < 1.0`
 * + SQLite         : Incompatible.
 *   SQLite's `RANDOM()` function returns a value between `-9223372036854775808` and `+9223372036854775807`.
 *   See algorithm below to emulate.
 *   Or just use a user-defined function...
 *
 * -----
 *
 * SQLite emulation,
 * ```sql
 *  COALESCE(
 *      NULLIF(
 *          ABS(RANDOM()+0e0) / 9223372036854775809e0,
 *          1
 *      ),
 *      0.999999999999999
 *  )
 * ```
 */
export const random = makeOperator0<OperatorType.RANDOM, number>(
    OperatorType.RANDOM,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
