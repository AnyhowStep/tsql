import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

/**
 * Returns the cube root
 *
 * + https://dev.mysql.com/doc/refman/5.7/en/mathematical-functions.html#function_pow
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
 *
 * -----
 *
 * + MySQL        : `IF(x >= 0, POWER(x, 1.0/3.0), -POWER(-x, 1.0/3.0))` The `.0` parts are important!
 * + PostgreSQL   : `||/` or `CBRT(x)` (Lets not use the ugly `||/` operator)
 * + SQLite       : Requres creating a `CBRT(x)` user-defined function
 *
 * -----
 *
 * MySQL
 * ```sql
 * SELECT POWER(27, 1.0/3.0)
 * > 3
 * ```
 *
 * PostgreSQL
 * ```sql
 * SELECT POWER(27, 1.0/3.0)
 * > 2.99999999999999999997
 *
 * SELECT CBRT(27)
 * > 3
 * ```
 */
export const cbrt = makeOperator1<OperatorType.CUBE_ROOT, number, number>(
    OperatorType.CUBE_ROOT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
