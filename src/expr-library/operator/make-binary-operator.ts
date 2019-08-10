import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";

export type BinaryOperator<
    InputTypeT,
    OutputTypeT
> = (
    <
        LeftT extends RawExpr<InputTypeT>,
        RightT extends RawExpr<InputTypeT>
    > (
        left : LeftT,
        right : RightT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<
                | LeftT
                | RightT
            >,
        }>
    )
);
export function makeBinaryOperator<
    InputTypeT,
    OutputTypeT
> (
    operatorAst : string,
    mapper : tm.SafeMapper<OutputTypeT>
) {
    const result : BinaryOperator<InputTypeT, OutputTypeT> = <
        LeftT extends RawExpr<InputTypeT>,
        RightT extends RawExpr<InputTypeT>
    > (
        left : LeftT,
        right : RightT
    ) : (
        Expr<{
            mapper : tm.SafeMapper<OutputTypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<
                | LeftT
                | RightT
            >,
        }>
    ) => {
        return expr(
            {
                mapper,
                usedRef : RawExprUtil.intersectUsedRef(
                    left,
                    right
                ),
            },
            [
                RawExprUtil.buildAst(left),
                operatorAst,
                RawExprUtil.buildAst(right),
            ]
        );
    };

    return result;
}
