import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Similar to calculating the arc tangent of `Y / X`,
 * except that the signs of both arguments are used
 * to determine the quadrant of the result.
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_atan2
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `ATAN2(y, x)`
 * + PostgreSQL     : `ATAN2(y, x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * @param left  - The Y of the vector
 * @param right - The X of the vector
 */
export const atan2 = makeOperator2<OperatorType.ARC_TANGENT_2, number, number>(
    OperatorType.ARC_TANGENT_2,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
