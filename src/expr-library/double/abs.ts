import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1Idempotent} from "../factory";
import {TypeHint} from "../../type-hint";

/**
 * Returns the absolute value
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_abs
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://www.sqlite.org/lang_corefunc.html#abs
 *
 * -----
 *
 * + MySQL        : `ABS(x)`
 * + PostgreSQL   : `ABS(x)`
 * + SQLite       : `ABS(x)`
 *   + `ABS(Infinity)  = Infinity`
 *   + `ABS(-Infinity) = Infinity`
 *
 * -----
 *
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 */
export const abs = makeOperator1Idempotent<OperatorType.ABSOLUTE_VALUE, number, number>(
    OperatorType.ABSOLUTE_VALUE,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
