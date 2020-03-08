import * as tm from "type-mapping";
import {BuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {Ast} from "../../ast";
import {Operator1} from "../factory";

export function makeCustomOperator1<
    InputTypeT=never,
    OutputTypeT=never
> (
    astDelegate : (arg : BuiltInExpr<InputTypeT>) => Ast,
    mapper : tm.SafeMapper<OutputTypeT>
) : (
    Operator1<InputTypeT, OutputTypeT>
) {
    const result : Operator1<InputTypeT, OutputTypeT> = <
        ArgT extends BuiltInExpr<InputTypeT>
    > (
        arg : ArgT
    ) : (
        ExprUtil.Intersect<OutputTypeT, ArgT>
    ) => {
        return ExprUtil.intersect<OutputTypeT, ArgT>(
            mapper,
            [arg],
            astDelegate(arg)
        );
    };

    return result;
}
