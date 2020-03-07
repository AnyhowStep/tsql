import * as tm from "type-mapping";
import {makeOperator3, Operator3} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string `str`
 * with all occurrences of the string `from`
 * replaced by the string `to`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_replace
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 * + https://www.sqlite.org/lang_corefunc.html#replace
 *
 * -----
 *
 * + MySQL          : `REPLACE(str, from, to)`
 * + PostgreSQL     : `REPLACE(str, from, to)`
 * + SQLite         : `REPLACE(str, from, to)`
 *
 * -----
 *
 * @param left  - The string to transform
 * @param mid   - The string to look for
 * @param right - The replacement string
 */
export const replace : Operator3<string, string, string, string> = makeOperator3<OperatorType.REPLACE, string, string, string, string>(
    OperatorType.REPLACE,
    tm.string(),
    TypeHint.STRING
);
