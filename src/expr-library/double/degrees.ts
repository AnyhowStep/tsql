import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Converts from radians to degrees.
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_degrees
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 *
 * -----
 *
 * + MySQL          : `DEGREES(x)`
 * + PostgreSQL     : `DEGREES(x)`
 * + SQLite         : None, use `x * (180.0/3.1415926535897932384626433832795028841971693993751)`
 *
 * -----
 *
 * @param arg - radians
 * @returns degrees
 */
export const degrees = makeOperator1<OperatorType.DEGREES, number, number>(
    OperatorType.DEGREES,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
