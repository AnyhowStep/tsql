import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1ToN} from "./make-operator-1-to-n";
import {BaseType} from "../../type-util";

export type Equation1ToNReturn<
    Arg0T extends AnyBuiltInExpr,
    ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|ArgsT[number]
    >
;
export type Equation1ToN =
    <
        Arg0T extends AnyBuiltInExpr,
        ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T & BuiltInExprUtil.AssertNonNull<Arg0T>,
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
    ) as Equation1ToN;
}
