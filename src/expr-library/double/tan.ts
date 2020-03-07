import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1, Operator1} from "../factory";

/**
 * Returns the tangent
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_tan
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `TAN(x)`
 * + PostgreSQL     : `TAN(x)`
 * + SQLite         : None, implement with user-defined function
 *   + `extension-functions.c` from https://www.sqlite.org/contrib returns `null` for `TAN(1e999)`
 *
 * -----
 *
 * @param arg - Radians
 * @returns The tangent
 */
export const tan : Operator1<number, number|null> = makeOperator1<OperatorType.TANGENT, number, number|null>(
    OperatorType.TANGENT,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
