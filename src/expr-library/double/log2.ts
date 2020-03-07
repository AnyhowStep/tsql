import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1, Operator1} from "../factory";

/**
 * Returns the base-2 logarithm
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log2
 *
 * -----
 *
 * + MySQL          : `LOG2(x)`
 * + PostgreSQL     : `LOG(2.0, x)`
 * + SQLite         : None, implment with user-defined function
 *
 * -----
 *
 * + MySQL      : `LOG2(0)` === `NULL`
 * + PostgreSQL : `LOG(2, 0)` throws error
 *
 * -----
 *
 * + MySQL      : `LOG2(-1)` === `NULL`
 * + PostgreSQL : `LOG(2, -1)` throws error
 */
export const log2 : Operator1<number, number|null> = makeOperator1<OperatorType.LOG2, number, number|null>(
    OperatorType.LOG2,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
