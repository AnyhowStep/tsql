import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export type ThrowIfNullExpr<
    ArgT extends AnyBuiltInExpr
> =
    ExprUtil.Intersect<
        Exclude<BuiltInExprUtil.TypeOf<ArgT>, null>,
        ArgT
    >
;
export function throwIfNull<
    ArgT extends AnyBuiltInExpr
> (
    arg : ArgT
) : (
    ThrowIfNullExpr<ArgT>
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
