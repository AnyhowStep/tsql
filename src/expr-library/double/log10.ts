import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1, Operator1} from "../factory";

/**
 * Returns the base-10 logarithm
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log10
 *
 * -----
 *
 * + MySQL          : `LOG10(x)`
 * + PostgreSQL     : `LOG(10.0, x)`
 * + SQLite         : None, implment with user-defined function
 *
 * -----
 *
 * + MySQL      : `LOG10(0)` === `NULL`
 * + PostgreSQL : `LOG(10, 0)` throws error
 *
 * -----
 *
 * + MySQL      : `LOG10(-1)` === `NULL`
 * + PostgreSQL : `LOG(10, -1)` throws error
 */
export const log10 : Operator1<number, number|null> = makeOperator1<OperatorType.LOG10, number, number|null>(
    OperatorType.LOG10,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
