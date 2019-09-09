import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";

export type UnaryOperator<
    InputTypeT,
    OutputTypeT
> =
    <
        ArgT extends RawExpr<InputTypeT>
    > (
        arg : ArgT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            /**
             * @todo Use `TryReuseExistingType<>` hack to fight off depth limit
             */
            usedRef : RawExprUtil.UsedRef<ArgT>,
        }>
    )
;
export function makeUnaryOperator<
    OperatorTypeT extends OperatorType,
    InputTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>
) {
    const result : UnaryOperator<InputTypeT, OutputTypeT> = <
        ArgT extends RawExpr<InputTypeT>
    > (
        arg : ArgT
    ) : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.UsedRef<ArgT>,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : RawExprUtil.usedRef(arg),
            },
            OperatorNodeUtil.operatorNode1<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(arg),
                ]
            )
        );
    };

    return result;
}
