import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export function throwIfNull<
    ArgT extends AnyBuiltInExpr
> (
    arg : ArgT
) : (
    ExprUtil.Intersect<
        Exclude<BuiltInExprUtil.TypeOf<ArgT>, null>,
        ArgT
    >
) {
    return ExprUtil.intersect<Exclude<BuiltInExprUtil.TypeOf<ArgT>, null>, ArgT>(
        tm.notNull(BuiltInExprUtil.mapper(arg)),
        [arg],
        OperatorNodeUtil.operatorNode1(
            OperatorType.THROW_IF_NULL,
            [
                BuiltInExprUtil.buildAst(arg)
            ],
            undefined
        )
    );
}
