import * as tm from "type-mapping";
import {Ast} from "../../ast";
import {Operator0} from "../factory";
import {Expr, expr} from "../../expr";
import {UsedRefUtil, IUsedRef} from "../../used-ref";

export function makeCustomOperator0<
    OutputTypeT=never
> (
    ast : Ast,
    mapper : tm.SafeMapper<OutputTypeT>
) : (
    Operator0<OutputTypeT>
) {
    const result : Operator0<OutputTypeT> = () : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
            isAggregate : false,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : UsedRefUtil.fromColumnRef({}),
                isAggregate : false,
            },
            ast
        );
    };

    return result;
}
