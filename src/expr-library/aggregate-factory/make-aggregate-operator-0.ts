import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {TypeHint} from "../../type-hint";

export type AggregateOperator0<
    OutputTypeT
> =
    () => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
            isAggregate : true,
        }>
    )
;
export function makeAggregateOperator0<
    OperatorTypeT extends OperatorType,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand0<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    AggregateOperator0<OutputTypeT>
) {
    const result : AggregateOperator0<OutputTypeT> = () : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
            isAggregate : true,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : UsedRefUtil.fromColumnRef({}),
                isAggregate : true,
            },
            OperatorNodeUtil.operatorNode0<OperatorTypeT>(
                operatorType,
                typeHint
            )
        );
    };

    return result;
}
