import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * The natural exponential function
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_exp
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 * + https://en.wikipedia.org/wiki/Exponential_function
 *
 * -----
 *
 * + MySQL          : `EXP(x)`
 * + PostgreSQL     : `EXP(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * @param arg - The power value
 * @returns e^arg
 */
export const exp = makeOperator1<OperatorType.NATURAL_EXPONENTIATION, number, number>(
    OperatorType.NATURAL_EXPONENTIATION,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
