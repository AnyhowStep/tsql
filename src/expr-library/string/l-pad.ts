import * as tm from "type-mapping";
import {makeOperator3, Operator3} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";

/**
 * Returns a string, left-padded to the specified length.
 *
 * If input string is longer than the specified length,
 * the return value is shortened to the specified length.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_lpad
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `LPAD(str, len, padstr)`
 *   + `LPAD('123', 4, '98')` === `'9123'`
 *   + `LPAD('123', 2, '98')` === `'12'`
 *   + `LPAD('123', 5, '')`   === `NULL`
 *   + `LPAD('123', 2, '')`   === `'12'`
 *   + `LPAD('123', -2, 'a')` === `NULL`
 * + PostgreSQL     : `LPAD(str, len, padstr)`
 *   + `LPAD('123', 4, '98')` === `'9123'`
 *   + `LPAD('123', 2, '98')` === `'12'`
 *   + `LPAD('123', 5, '')`   === `'123'`
 *   + `LPAD('123', 2, '')`   === `'12'`
 *   + `LPAD('123', -2, 'a')` === `''`
 * + SQLite         : None. Implement with user-defined function.
 *
 * -----
 *
 * If the desired length is negative, or padding string is empty,
 * the behaviour cannot be unified.
 *
 * MySQL seems to return `NULL`.
 *
 * -----
 *
 * @param left  - The string to pad
 * @param mid   - The desired length of the output
 * @param right - The padding
 *
 * @see lPad
 */
export const lPadUnsafe : Operator3<string, bigint, string, string|null> = makeOperator3<OperatorType.LPAD, string, bigint, string, string|null>(
    OperatorType.LPAD,
    tm.orNull(tm.string()),
    TypeHint.STRING
);

/**
 * Returns a string, left-padded to the specified length.
 *
 * If input string is longer than the specified length,
 * the return value is shortened to the specified length.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_lpad
 * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
 *
 * -----
 *
 * + MySQL          : `LPAD(str, len, padstr)`
 *   + `LPAD('123', 4, '98')` === `'9123'`
 *   + `LPAD('123', 2, '98')` === `'12'`
 * + PostgreSQL     : `LPAD(str, len, padstr)`
 *   + `LPAD('123', 4, '98')` === `'9123'`
 *   + `LPAD('123', 2, '98')` === `'12'`
 * + SQLite         : None. Implement with user-defined function.
 *
 * -----
 *
 * This function does not allow negative `desiredLength`, or empty `padding`.
 *
 * -----
 *
 * @param str           - The string to pad
 * @param desiredLength - The desired length of the output; must not be negative
 * @param padding       - The padding; must not be empty
 *
 * @see lPadUnsafe
 */
export function lPad<
    StrT extends BuiltInExpr<string>
> (
    str : StrT,
    desiredLength : bigint,
    padding : string
) : (
    ExprUtil.Intersect<string, StrT>
) {
    desiredLength = tm.bigIntGtEq(tm.BigInt(0))(`desiredLength`, desiredLength);
    padding = tm.stringLength({ min : 1 })(`padding`, padding);

    return ExprUtil.intersect(
        tm.string(),
        [str, desiredLength, padding],
        OperatorNodeUtil.operatorNode3<OperatorType.LPAD>(
            OperatorType.LPAD,
            [
                BuiltInExprUtil.buildAst(str),
                BuiltInExprUtil.buildAst(desiredLength),
                BuiltInExprUtil.buildAst(padding),
            ],
            TypeHint.STRING
        )
    ) as ExprUtil.Intersect<string, StrT>;
}
