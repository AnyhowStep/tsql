import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the length of the string in bits.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_bit-length
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 *
 * -----
 *
 * + MySQL          : `BIT_LENGTH(x)`
 * + PostgreSQL     : `BIT_LENGTH(x)`
 * + SQLite         : `LENGTH(CAST(x AS BLOB)) * 8`
 *
 * -----
 *
 * The character set of the string can affect the result of this function.
 * For example, on MySQL 5.7,
 * ```sql
 *  BIT_LENGTH(CHAR(128 USING latin1))
 *  > 8
 *
 *  BIT_LENGTH(CHAR(128 USING utf32))
 *  > 32
 * ```
 *
 * https://www.db-fiddle.com/f/bmj7sAFhiPpFGNVAhBdi3Q/3
 */
export const bitLength = makeOperator1<OperatorType.BIT_LENGTH, string, bigint>(
    OperatorType.BIT_LENGTH,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
