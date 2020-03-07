import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1Idempotent, Operator1} from "../factory";

/**
 * + If the argument is negative, returns -1
 * + If the argument is positive, returns  1
 * + If the argument is zero, returns 0
 *
 * -----
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sign
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 *
 * -----
 *
 * + MySQL          : `SIGN(x)`
 * + PostgreSQL     : `SIGN(x)`
 * + SQLite         : `CASE WHEN x > 0 THEN 1e0 WHEN x < 0 THEN -1e0 ELSE 0e0 END`
 *
 * -----
 *
 * This function is idempotent.
 * `SIGN(SIGN(x)) == SIGN(x)`
*/
export const sign : Operator1<number, number> = makeOperator1Idempotent<OperatorType.SIGN, number, number>(
    OperatorType.SIGN,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
