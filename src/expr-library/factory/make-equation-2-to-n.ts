import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2ToN} from "./make-operator-2-to-n";
import {BaseType} from "../../type-util";

export type Equation2ToNReturn<
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Equation2ToN =
    <
        Arg0T extends AnyBuiltInExpr,
        Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T & BuiltInExprUtil.AssertNonNull<Arg0T>,
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
    ) as Equation2ToN;
}
