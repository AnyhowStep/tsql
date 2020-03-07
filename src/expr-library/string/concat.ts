import * as tm from "type-mapping";
import {makeOperator1ToN, Operator1ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the string that results from concatenating the arguments.
 * May have one or more arguments.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `CONCAT(x, ...)` Returns `NULL` if any argument is `NULL`
 *   + MySQL actually treats `||` as the boolean `OR` operator.
 * + PostgreSQL     : `x || ... || ...` Returns `NULL` if any argument is `NULL`
 *   + PostgreSQL's `CONCAT(x, ...)` Ignores `NULL` arguments
 *     + This is different from MySQL's `CONCAT()`
 * + SQLite         : `x || ... || ...` Returns `NULL` if any argument is `NULL`
 *   + SQLite uses an operator, not a function, to concatenate strings
 *   + https://www.sqlite.org/lang_expr.html#collateop
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
 * @see nullSafeConcat
 */
export const concat : Operator1ToN<string, string> = makeOperator1ToN<OperatorType.CONCAT, string, string>(
    OperatorType.CONCAT,
    tm.string(),
    TypeHint.STRING
);
