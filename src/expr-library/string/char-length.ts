import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the length of the string, measured in characters.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_char-length
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 * + https://www.sqlite.org/lang_corefunc.html#length
 * + https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#33-string-length
 *
 * -----
 *
 * + MySQL          : `CHAR_LENGTH(x)`
 *   + `CHAR_LENGTH('cafȩ́')` returns 6
 * + PostgreSQL     : `CHAR_LENGTH(x)`
 *   + `CHAR_LENGTH('cafȩ́')` returns 8
 * + SQLite         : `LENGTH(x)`
 *   + `LENGTH('cafȩ́')` returns 6
 *
 * -----
 *
 * Surrogate pairs may cause results to differ across databases.
 */
export const charLength = makeOperator1<OperatorType.CHAR_LENGTH, string, bigint>(
    OperatorType.CHAR_LENGTH,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
