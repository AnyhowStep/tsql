import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Converts each byte of the input to two hexadecimal digits.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_hex
 * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
 * + https://www.sqlite.org/lang_corefunc.html#hex
 *
 * -----
 *
 * + MySQL          : `HEX(x)`
 * + PostgreSQL     : `ENCODE(x, 'hex')`
 * + SQLite         : `HEX(x)`
 */
export const hex : Operator1<Uint8Array, string> = makeOperator1<OperatorType.HEX, Uint8Array, string>(
    OperatorType.HEX,
    tm.string(),
    TypeHint.BUFFER
);
