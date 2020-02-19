import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * Returns the logarithm to the specified `base`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 *
 * -----
 *
 * + MySQL          : `LOG(base, x)`
 * + PostgreSQL     : `LOG(base, x)`
 * + SQLite         : None, implment with user-defined function
 *
 * -----
 *
 * + MySQL      : `LOG(0, 0)` === `NULL`
 * + PostgreSQL : `LOG(0, 0)` throws error
 *
 * -----
 *
 * + MySQL      : `LOG(1, 5)` === `NULL`
 * + PostgreSQL : `LOG(1, 5)` throws error
 *
 * -----
 *
 * @param left  - The base
 * @param right - The anti-logarithm
 * @returns log_{base}(anti-logarithm) = logarithm
 */
export const log = makeOperator2<OperatorType.LOG, number, number|null>(
    OperatorType.LOG,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
