import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Returns the square root
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sqrt
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
 *
 * -----
 *
 * + MySQL        : `SQRT(x)`
 * + PostgreSQL   : `|/` or `SQRT(x)` (Lets not use the ugly `|/` operator)
 * + SQLite       : Requres creating a `SQRT(x)` user-defined function
 *
 * -----
 *
 * + MySQL      : `SQRT(-5)` === `null`
 * + PostgreSQL : `SQRT(-5)` throws error
 */
export const sqrt = makeOperator1<OperatorType.SQUARE_ROOT, number, number|null>(
    OperatorType.SQUARE_ROOT,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
