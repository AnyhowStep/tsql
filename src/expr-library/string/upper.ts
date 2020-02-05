import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with all characters changed to uppercase
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_upper
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 * + https://www.sqlite.org/lang_corefunc.html#upper
 *
 * -----
 *
 * + MySQL          : `UPPER(x)`
 * + PostgreSQL     : `UPPER(x)`
 * + SQLite         : `UPPER(x)`
 */
export const upper = makeOperator1<OperatorType.UPPER, string, string>(
    OperatorType.UPPER,
    tm.string(),
    TypeHint.STRING
);
