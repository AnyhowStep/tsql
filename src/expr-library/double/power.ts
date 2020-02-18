import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * Returns `base^exponent`
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_power
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
 *
 * -----
 *
 * + MySQL        : `POWER(base, exponent)`
 * + PostgreSQL   : `^` or `POWER(base, exponent)` (Let's not use the ugly `^` operator)
 * + SQLite         : None, implement with user-defined function
 *   + `extension-functions.c` from https://www.sqlite.org/contrib returns `null` for `POWER(-1, 0.5)`
 *
 * -----
 *
 * MySQL throws if base is negative, and exponent is non-integer.
 *
 * -----
 *
 * @param left  - The base
 * @param right - The exponent
 * @returns base^exponent
 */
export const power = makeOperator2<OperatorType.POWER, number, number|null>(
    OperatorType.POWER,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
