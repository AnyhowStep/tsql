import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Operator3<
    LeftTypeT,
    MidTypeT,
    RightTypeT,
    OutputTypeT
> =
    <
        LeftT extends RawExpr<LeftTypeT>,
        MidT extends RawExpr<MidTypeT>,
        RightT extends RawExpr<RightTypeT>
    > (
        left : LeftT,
        mid : MidT,
        right : RightT
    ) => (
        ExprUtil.Intersect<OutputTypeT, LeftT|MidT|RightT>
    )
;

export function makeOperator3<
    OperatorTypeT extends OperatorType,
    LeftTypeT=never,
    MidTypeT=never,
    RightTypeT=never,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand3<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator3<LeftTypeT, MidTypeT, RightTypeT, OutputTypeT>
) {
    const result : Operator3<LeftTypeT, MidTypeT, RightTypeT, OutputTypeT> = <
        LeftT extends RawExpr<LeftTypeT>,
        MidT extends RawExpr<MidTypeT>,
        RightT extends RawExpr<RightTypeT>
    > (
        left : LeftT,
        mid : MidT,
        right : RightT
    ) : (
        ExprUtil.Intersect<OutputTypeT, LeftT|MidT|RightT>
    ) => {
        return ExprUtil.intersect<OutputTypeT, LeftT|MidT|RightT>(
            mapper,
            [left, mid, right],
            OperatorNodeUtil.operatorNode3<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(left),
                    RawExprUtil.buildAst(mid),
                    RawExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };

    return result;
}
