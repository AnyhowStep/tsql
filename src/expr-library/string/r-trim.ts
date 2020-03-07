import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with trailing **space** characters removed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_rtrim
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 * + https://www.sqlite.org/lang_corefunc.html#rtrim
 *
 * -----
 *
 * + MySQL          : `RTRIM(x)`
 * + PostgreSQL     : `RTRIM(x)/RTRIM(x, y)`
 * + SQLite         : `RTRIM(x)/RTRIM(x, y)`
 *
 * -----
 *
 * Does not remove other trailing whitespace. Only removes trailing spaces.
 */
export const rTrim : Operator1<string, string> = makeOperator1<OperatorType.RTRIM, string, string>(
    OperatorType.RTRIM,
    tm.string(),
    TypeHint.STRING
);
