//import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil, BuiltInExpr} from "../../built-in-expr";
import {CoalesceExpr, coalesceMapper} from "./coalesce";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeOfCoalesce} from "./type-of-coalesce";
import {BaseType} from "../../type-util";

/**
 * Equivalent to `COALESCE()` with two arguments.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_ifnull
 * + https://www.postgresql.org/docs/9.2/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL
 * + https://www.sqlite.org/lang_corefunc.html#ifnull
 *
 * -----
 *
 * `COALESCE()` is part of the SQL standard.
 * `IFNULL()` is DB-specific.
 *
 * But `IFNULL()` should behave the same as `COALESCE(x, y)`.
 *
 * -----
 *
 * + MySQL        : `IFNULL(x, y)`
 * + PostgreSQL   : `COALESCE(x, y)`
 * + SQLite       : `IFNULL(x, y)`
 *
 * -----
 *
 * @see coalesce
 */
export function ifNull<
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>|null>
> (
    arg0 : Arg0T,
    arg1 : Arg1T
) : (
    CoalesceExpr<[Arg0T, Arg1T]>
) {
    return ExprUtil.intersect<TypeOfCoalesce<[Arg0T, Arg1T]>, Arg0T|Arg1T>(
        coalesceMapper(arg0, arg1),
        [arg0, arg1],
        OperatorNodeUtil.operatorNode2(
            OperatorType.IF_NULL,
            [
                BuiltInExprUtil.buildAst(arg0),
                BuiltInExprUtil.buildAst(arg1)
            ],
            undefined
        )
    );
}
