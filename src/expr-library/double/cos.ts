import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Returns the cosine
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_cos
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `COS(x)`
 * + PostgreSQL     : `COS(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * @param arg - Radians
 * @returns The cosine
 */
export const cos = makeOperator1<OperatorType.COSINE, number, number>(
    OperatorType.COSINE,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
