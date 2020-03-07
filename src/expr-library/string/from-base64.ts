import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Takes a base-64 encoded string,
 * and returns the decoded result as a `BLOB/bytea`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_from-base64
 * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `FROM_BASE64(x)`
 *   + `FROM_BASE64('~')` === `NULL`
 * + PostgreSQL     : `DECODE(x, 'base64')`
 *   + `DECODE('~', 'base64')` throws an error
 * + SQLite         : None, implement with user-defined function `atob()`
 *   + `atob('~')` throws an error
 *
 * -----
 *
 * If the input is not a valid base-64 string, some databases throw an error.
 * Others return `NULL`.
 */
export const fromBase64 : Operator1<string, Uint8Array|null> = makeOperator1<OperatorType.FROM_BASE64, string, Uint8Array|null>(
    OperatorType.FROM_BASE64,
    tm.orNull(tm.instanceOfUint8Array()),
    TypeHint.STRING
);
