import * as tm from "type-mapping";
import {AnyBuiltInExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export function nullIf<
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends AnyBuiltInExpr
> (
    arg0 : Arg0T,
    arg1 : Arg1T
) : (
    ExprUtil.Intersect<
        RawExprUtil.TypeOf<Arg0T>|null,
        Arg0T|Arg1T
    >
)  {
    return ExprUtil.intersect<RawExprUtil.TypeOf<Arg0T>|null, Arg0T|Arg1T>(
        tm.orNull(RawExprUtil.mapper(arg0)),
        [arg0, arg1],
        OperatorNodeUtil.operatorNode2(
            OperatorType.NULL_IF_EQUAL,
            [
                RawExprUtil.buildAst(arg0),
                RawExprUtil.buildAst(arg1)
            ],
            undefined
        )
    );
}
/**
 * Synonym for `NULLIF(x, y)`
 */
export const nullIfEqual : typeof nullIf = nullIf;
