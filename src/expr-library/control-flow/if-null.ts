//import * as tm from "type-mapping";
import {AnyBuiltInExpr, RawExprUtil} from "../../raw-expr";
import {CoalesceExpr, TypeOfCoalesce, coalesceMapper} from "./coalesce";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export function ifNull<
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends AnyBuiltInExpr
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
                RawExprUtil.buildAst(arg0),
                RawExprUtil.buildAst(arg1)
            ],
            undefined
        )
    );
}
