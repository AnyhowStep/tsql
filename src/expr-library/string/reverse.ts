import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with the order of the characters reversed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_reverse
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `REVERSE(x)`
 * + PostgreSQL     : `REVERSE(x)`
 * + SQLite         : None. Implement with user-defined function.
 */
export const reverse = makeOperator1<OperatorType.REVERSE, string, string>(
    OperatorType.REVERSE,
    tm.string(),
    TypeHint.STRING
);
