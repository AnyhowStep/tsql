import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Repeats a string the specified amount of times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_repeat
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `REPEAT(x, count)`
 * + PostgreSQL     : `REPEAT(x, count)`
 * + SQLite         : None. Implement with user-defined function.
 *
 * -----
 *
 * If the specified amount is zero or less, it returns an empty string.
 *
 * -----
 *
 * @param left  - The string to repeat
 * @param right - The amount of times to repeat the string
 */
export const repeat = makeOperator2<OperatorType.REPEAT, string, bigint, string>(
    OperatorType.REPEAT,
    tm.string(),
    TypeHint.STRING
);
