import * as tm from "type-mapping";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {TypeHint} from "../../type-hint";

export type Operator0<
    OutputTypeT
> =
    () => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : IUsedRef<{}>,
            isAggregate : false,
        }>
    )
;
export function makeOperator0<
    OperatorTypeT extends OperatorType,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand0<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
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
            OperatorNodeUtil.operatorNode0<OperatorTypeT>(
                operatorType,
                typeHint
            )
        );
    };

    return result;
}
