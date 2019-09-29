import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {makeOperator2ToN} from "./make-operator-2-to-n";

export type Equation2ToNReturn<
    Arg0T extends RawExpr<NonNullEquatableType>,
    Arg1T extends RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Equation2ToN =
    <
        Arg0T extends RawExpr<NonNullEquatableType>,
        Arg1T extends RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        Equation2ToNReturn<Arg0T, Arg1T, ArgsT>
    )
;

export function makeEquation2ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    Equation2ToN
) {
    return makeOperator2ToN<OperatorTypeT, any, boolean>(
        operatorType,
        tm.mysql.boolean(),
        typeHint
    );
}
