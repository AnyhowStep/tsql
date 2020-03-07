import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the length of the string, measured in bytes.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_octet-length
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 *
 * -----
 *
 * + MySQL          : `OCTET_LENGTH(x)`
 * + PostgreSQL     : `OCTET_LENGTH(x)`
 * + SQLite         : `LENGTH(CAST(x AS BLOB))`
 *
 * -----
 *
 * The character set of the string can affect the result of this function.
 * For example, on MySQL 5.7,
 * ```sql
 *  OCTET_LENGTH(CHAR(128 USING latin1))
 *  > 1
 *
 *  OCTET_LENGTH(CHAR(128 USING utf32))
 *  > 4
 * ```
 *
 * https://www.db-fiddle.com/f/bmj7sAFhiPpFGNVAhBdi3Q/4
 */
export const octetLength : Operator1<string, bigint> = makeOperator1<OperatorType.OCTET_LENGTH, string, bigint>(
    OperatorType.OCTET_LENGTH,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
