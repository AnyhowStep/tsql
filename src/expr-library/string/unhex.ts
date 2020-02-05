import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Takes a hex encoded string,
 * and returns the decoded result as a `BLOB/bytea`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_unhex
 * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `UNHEX(x)`
 *   + `UNHEX('~')` === `NULL`
 * + PostgreSQL     : `DECODE(x, 'hex')`
 *   + `DECODE('~', 'hex')` throws an error
 * + SQLite         : None. Implement with user-defined function.
 *
 * -----
 *
 * If the input is not a valid hex string, some databases throw an error.
 * Others return `NULL`.
 */
export const unhex = makeOperator1<OperatorType.UNHEX, string, Uint8Array|null>(
    OperatorType.UNHEX,
    tm.orNull(tm.instanceOfUint8Array()),
    TypeHint.STRING
);
