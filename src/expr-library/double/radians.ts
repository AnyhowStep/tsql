import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Converts from degrees to radians.
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_radians
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 *
 * -----
 *
 * + MySQL          : `RADIANS(x)`
 * + PostgreSQL     : `RADIANS(x)`
 * + SQLite         : None, use `x * (3.1415926535897932384626433832795028841971693993751/180.0)`
 *
 * -----
 *
 * @param arg - degrees
 * @returns radians
 */
export const radians = makeOperator1<OperatorType.RADIANS, number, number>(
    OperatorType.RADIANS,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
