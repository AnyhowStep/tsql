import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Converts the argument to base-64 encoded form.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_to-base64
 * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `TO_BASE64(x)`
 * + PostgreSQL     : `ENCODE(x, 'base64')`
 * + SQLite         : None, implement with user-defined function `btoa()`
 */
export const toBase64 : Operator1<Uint8Array, string> = makeOperator1<OperatorType.TO_BASE64, Uint8Array, string>(
    OperatorType.TO_BASE64,
    tm.string(),
    TypeHint.STRING
);
