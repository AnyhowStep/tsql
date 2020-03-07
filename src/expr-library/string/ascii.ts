import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the numeric value of the leftmost character of the string.
 *
 * -----
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_ascii
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `ASCII(x)`
 * + PostgreSQL     : `ASCII(x)`
 * + SQLite         : None, implement with `x.length == 0 ? 0 : x.charCodeAt(0)`
 *
 * -----
 *
 * The character set of the string can affect the result of this function.
 * For example, on MySQL 5.7,
 * ```sql
 *  ASCII(CHAR(128 USING latin1))
 *  > 128
 *
 *  ASCII(CHAR(128 USING utf32))
 *  > 0
 * ```
 *
 * https://www.db-fiddle.com/f/bmj7sAFhiPpFGNVAhBdi3Q/2
 */
export const ascii : Operator1<string, bigint> = makeOperator1<OperatorType.ASCII, string, bigint>(
    OperatorType.ASCII,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
