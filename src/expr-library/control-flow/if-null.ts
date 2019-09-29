import * as tm from "type-mapping";
import {AnyRawExpr, RawExprUtil} from "../../raw-expr";
import {CoalesceExpr, TypeOfCoalesce} from "./coalesce";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export function ifNull<
    Arg0T extends AnyRawExpr,
    Arg1T extends AnyRawExpr
> (
    arg0 : Arg0T,
    arg1 : Arg1T
) : (
    CoalesceExpr<[Arg0T, Arg1T]>
) {
    return ExprUtil.intersect<TypeOfCoalesce<[Arg0T, Arg1T]>, Arg0T|Arg1T>(
        tm.unsafeOr(
            RawExprUtil.mapper(arg0),
            RawExprUtil.mapper(arg1)
        ) as tm.SafeMapper<any>,
        [arg0, arg1],
        OperatorNodeUtil.operatorNode2(
            OperatorType.IF_NULL,
            [
                RawExprUtil.buildAst(arg0),
                RawExprUtil.buildAst(arg1)
            ],
            undefined
        )
    );
}
