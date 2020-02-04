import * as tm from "type-mapping";
import {makeOperator1ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string that results from concatenating the arguments.
 * May have one or more arguments.
 * `NULL` values are treated as empty strings.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : None. Emulate with `CONCAT(COALESCE(x, ''), ...)`
 * + PostgreSQL     : `CONCAT(x, ...)`
 *   + PostgreSQL's `CONCAT(x, ...)` Ignores `NULL` arguments
 *     + This is different from MySQL's `CONCAT()`
 * + SQLite         : `COALESCE(x, '') || ... || ...`
 *
 * -----
 *
 * The SQL standard says,
 * > `<concatenation operator>` is an operator, `||`,
 * > that returns the character string made by joining its character string operands in the order given.
 *
 * MySQL actually treats `||` as the boolean `OR` operator.
 *
 * -----
 *
 * @see concat
 */
export const nullSafeConcat = makeOperator1ToN<OperatorType.NULL_SAFE_CONCAT, string|null, string>(
    OperatorType.NULL_SAFE_CONCAT,
    tm.string(),
    TypeHint.STRING
);
