import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string with all characters changed to lowercase
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_lower
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 * + https://www.sqlite.org/lang_corefunc.html#lower
 *
 * -----
 *
 * + MySQL          : `LOWER(x)`
 * + PostgreSQL     : `LOWER(x)`
 * + SQLite         : `LOWER(x)`
 */
export const lower = makeOperator1<OperatorType.LOWER, string, string>(
    OperatorType.LOWER,
    tm.string(),
    TypeHint.STRING
);
