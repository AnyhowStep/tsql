import * as tm from "type-mapping";
import {BuiltInExprUtil, BuiltInExpr, AnyBuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {BaseType} from "../../type-util";

/**
 * This is equivalent to `IF(arg0 <null-safe-eq> arg1, null, arg0)`
 *
 * @param arg0
 * @param arg1
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
 * Synonym for `NULLIF(x, y)`
 */
export const nullIfEqual : typeof nullIf = nullIf;
