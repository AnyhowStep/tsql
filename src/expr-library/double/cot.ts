import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1, Operator1} from "../factory";

/**
 * Returns the cotangent
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_cot
 * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
 *
 * -----
 *
 * + MySQL          : `COT(x)`
 * + PostgreSQL     : `COT(x)`
 * + SQLite         : None, implement with user-defined function
 *   + `extension-functions.c` from https://www.sqlite.org/contrib returns `null` for `COT(1e999)`
 *
 * -----
 *
 * + MySQL      : `COT(0)` throws error
 * + PostgreSQL : `COT(0)` === `NULL`
 *
 * -----
 *
 * @param arg - Radians
 * @returns The cotangent
 */
export const cot : Operator1<number, number|null> = makeOperator1<OperatorType.COTANGENT, number, number|null>(
    OperatorType.COTANGENT,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
