import * as tm from "type-mapping";
import {makeOperator2ToN, Operator2ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Concatenate With Separator.
 * The first argument is the separator for the rest of the arguments.
 * The separator is added between the strings to be concatenated.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat-ws
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `CONCAT_WS(separator, x, ...)`
 *   + If the separator is `NULL`, the result is `NULL`
 *   + Ignores `NULL` arguments after the separator
 * + PostgreSQL     : `CONCAT_WS(separator, x, ...)`
 *   + If the separator is `NULL`, the result is `NULL`
 *   + Ignores `NULL` arguments after the separator
 * + SQLite         : None. Implement with user-defined function.
 */
export const concatWs : Operator2ToN<string, string|null, string|null, string> = makeOperator2ToN<OperatorType.CONCAT_WS, string, string|null, string|null, string>(
    OperatorType.CONCAT_WS,
    tm.string(),
    TypeHint.STRING
);
