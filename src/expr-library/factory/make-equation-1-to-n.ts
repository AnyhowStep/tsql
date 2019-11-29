import * as tm from "type-mapping";
import {BuiltInExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {makeOperator1ToN} from "./make-operator-1-to-n";

export type Equation1ToNReturn<
    Arg0T extends BuiltInExpr<NonNullEquatableType>,
    ArgsT extends readonly BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|ArgsT[number]
    >
;
export type Equation1ToN =
    <
        Arg0T extends BuiltInExpr<NonNullEquatableType>,
        ArgsT extends readonly BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        ...args : ArgsT
    ) => (
        Equation1ToNReturn<Arg0T, ArgsT>
    )
;

export function makeEquation1ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    Equation1ToN
) {
    return makeOperator1ToN<OperatorTypeT, any, boolean>(
        operatorType,
        tm.mysql.boolean(),
        typeHint
    );
}
