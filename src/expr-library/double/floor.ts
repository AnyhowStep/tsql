import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1Idempotent} from "../factory";

/**
 * Returns the floor of the number
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_floor
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 * + https://stackoverflow.com/questions/7129249/getting-the-floor-value-of-a-number-in-sqlite
 *
 * -----
 *
 * + MySQL        : `FLOOR(x)`
 * + PostgreSQL   : `FLOOR(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * ```sql
 *  SELECT FLOOR(1.1)
 *  > 1
 *
 *  SELECT FLOOR(-1.1)
 *  > -2
 * ```
 *
 * -----
 *
 * This function is idempotent.
 * `FLOOR(FLOOR(x)) == FLOOR(x)`
 */
export const floor = makeOperator1Idempotent<OperatorType.FLOOR, number, number>(
    OperatorType.FLOOR,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
