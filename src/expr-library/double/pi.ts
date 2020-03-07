import * as tm from "type-mapping";
import {makeOperator0, Operator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the value of pi
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_pi
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 * + https://en.wikipedia.org/wiki/Pi
 *
 * -----
 *
 * + MySQL          : `PI()`; MySQL's understanding of pi is... terrible
 *   + https://github.com/AnyhowStep/tsql/issues/252
 *   + The MySQL adapter library **should not** use `PI()`, it should use `3.141592653589793` instead
 * + PostgreSQL     : `PI()` Returns `3.14159265358979`
 * + SQLite         : None, implement using `3.141592653589793`
 *
 * -----
 *
 * In JS, `Math.PI` is `3.141592653589793`
 */
export const pi : Operator0<number> = makeOperator0<OperatorType.PI, number>(
    OperatorType.PI,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
