import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Returns the natural logarithm
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_ln
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 *
 * -----
 *
 * + MySQL          : `LN(x)`
 * + PostgreSQL     : `LN(x)`
 * + SQLite         : None, implment with user-defined function
 *
 * -----
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln = makeOperator1<OperatorType.LN, number, number|null>(
    OperatorType.LN,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
