import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the arc tangent.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_atan
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `ATAN(x)`
 * + PostgreSQL     : `ATAN(x)`
 * + SQLite         : None, implement with user-defined function
 */
export const atan = makeOperator1<OperatorType.ARC_TANGENT, number, number>(
    OperatorType.ARC_TANGENT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
