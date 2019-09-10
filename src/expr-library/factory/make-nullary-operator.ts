import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {IUsedRef, UsedRefUtil} from "../../used-ref";

export type NullaryOperator<
    OutputTypeT
> =
    () => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
        }>
    )
;
export function makeNullaryOperator<
    OperatorTypeT extends OperatorType,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand0<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>
) {
    const result : NullaryOperator<OutputTypeT> = () : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : UsedRefUtil.fromColumnRef({}),
            },
            OperatorNodeUtil.operatorNode0<OperatorTypeT>(
                operatorType
            )
        );
    };

    return result;
}
