import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the position of the first occurrence of the substring in the target.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_instr
 * + https://www.sqlite.org/lang_corefunc.html#instr
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `INSTR(str, substr)`
 * + PostgreSQL     : `STRPOS(str, substr)`
 * + SQLite         : `INSTR(str, substr)`
 *
 * -----
 *
 * @param left - The target of the search
 * @param right - The substring to look for
 *
 * -----
 *
 * If the substring is not found, it returns `0`.
 * Remember that string indices are one-based; not zero-based.
 */
export const inStr = makeOperator2<OperatorType.IN_STR, string, string, bigint>(
    OperatorType.IN_STR,
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
