import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with leading and trailing **space** characters removed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_trim
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 * + https://www.sqlite.org/lang_corefunc.html#trim
 *
 * -----
 *
 * + MySQL          : `TRIM(x)`
 * + PostgreSQL     : `TRIM(x)`
 * + SQLite         : `TRIM(x)`
 *
 * -----
 *
 * Does not remove other leading and trailing whitespace.
 * Only removes leading and trailing spaces.
 */
export const trim : Operator1<string, string> = makeOperator1<OperatorType.TRIM, string, string>(
    OperatorType.TRIM,
    tm.string(),
    TypeHint.STRING
);
