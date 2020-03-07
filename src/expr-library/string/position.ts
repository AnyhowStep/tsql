import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the position of the first occurrence of the substring in the target.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_position
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
 *
 * -----
 *
 * + MySQL          : `POSITION(substr IN str)`
 * + PostgreSQL     : `POSITION(substr IN str)`
 * + SQLite         : `INSTR(str, substr)`
 *
 * -----
 *
 * @param left  - The substring to look for
 * @param right - The target of the search
 *
 * -----
 *
 * If the substring is not found, it returns `0`.
 * Remember that string indices are one-based; not zero-based.
 *
 * @see inStr
 * @todo Remove `inStr()` and keep `position()`?
 */
export const position : Operator2<string, string, bigint> = makeOperator2<OperatorType.POSITION, string, string, bigint>(
    OperatorType.POSITION,
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
