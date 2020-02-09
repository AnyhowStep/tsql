import * as tm from "type-mapping";
import {BuiltInExprUtil, BuiltInExpr, AnyBuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {BaseType} from "../../type-util";

/**
 * Returns `null` if both arguments are null-safe equal.
 *
 * Otherwise, returns the first argument.
 *
 * This is equivalent to `IF(arg0 <null-safe-eq> arg1, null, arg0)`
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_nullif
 * + https://www.postgresql.org/docs/9.2/functions-conditional.html#FUNCTIONS-NULLIF
 * + https://www.sqlite.org/lang_corefunc.html#nullif
 *
 * -----
 *
 * + MySQL        : `NULLIF(x, y)`
 * + PostgreSQL   : `NULLIF(x, y)`
 * + SQLite       : `NULLIF(x, y)`
 *
 * @see nullIfEqual
 */
export function nullIf<
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>|null>
> (
    arg0 : Arg0T,
    arg1 : Arg1T
) : (
    ExprUtil.Intersect<
        BuiltInExprUtil.TypeOf<Arg0T>|null,
        Arg0T|Arg1T
    >
)  {
    return ExprUtil.intersect<BuiltInExprUtil.TypeOf<Arg0T>|null, Arg0T|Arg1T>(
        tm.orNull(BuiltInExprUtil.mapper(arg0)),
        [arg0, arg1],
        OperatorNodeUtil.operatorNode2(
            OperatorType.NULL_IF_EQUAL,
            [
                BuiltInExprUtil.buildAst(arg0),
                BuiltInExprUtil.buildAst(arg1)
            ],
            undefined
        )
    );
}

/**
 * Synonym for `NULLIF(x, y)`.
 *
 * Returns `null` if both arguments are null-safe equal.
 *
 * Otherwise, returns the first argument.
 *
 * This is equivalent to `IF(arg0 <null-safe-eq> arg1, null, arg0)`
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_nullif
 * + https://www.postgresql.org/docs/9.2/functions-conditional.html#FUNCTIONS-NULLIF
 * + https://www.sqlite.org/lang_corefunc.html#nullif
 *
 * -----
 *
 * + MySQL        : `NULLIF(x, y)`
 * + PostgreSQL   : `NULLIF(x, y)`
 * + SQLite       : `NULLIF(x, y)`
 *
 * @see nullIf
 */
export const nullIfEqual : typeof nullIf = nullIf;
