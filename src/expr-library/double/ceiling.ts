import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1Idempotent, Operator1} from "../factory";

/**
 * Returns the ceiling of the number
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_ceiling
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
 * + https://stackoverflow.com/questions/14969067/getting-the-ceil-value-of-a-number-in-sqlite
 *
 * -----
 *
 * + MySQL        : `CEIL(x)/CEILING(x)`
 * + PostgreSQL   : `CEIL(x)/CEILING(x)`
 * + SQLite         : None, implement with user-defined function
 *
 * -----
 *
 * ```sql
 *  SELECT CEILING(1.1)
 *  > 2
 *
 *  SELECT CEILING(-1.1)
 *  > -1
 * ```
 *
 * -----
 *
 * This function is idempotent.
 * `CEILING(CEILING(x)) == CEILING(x)`
 */
export const ceiling : Operator1<number, number> = makeOperator1Idempotent<OperatorType.CEILING, number, number>(
    OperatorType.CEILING,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
