import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with leading **space** characters removed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_ltrim
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 * + https://www.sqlite.org/lang_corefunc.html#ltrim
 *
 * -----
 *
 * + MySQL          : `LTRIM(x)`
 * + PostgreSQL     : `LTRIM(x)/LTRIM(x, y)`
 * + SQLite         : `LTRIM(x)/LTRIM(x, y)`
 *
 * -----
 *
 * Does not remove other leading whitespace. Only removes leading spaces.
 */
export const lTrim = makeOperator1<OperatorType.LTRIM, string, string>(
    OperatorType.LTRIM,
    tm.string(),
    TypeHint.STRING
);
