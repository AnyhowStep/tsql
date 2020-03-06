import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullComparableType} from "../../comparable-type";
import {makeOperator2ToN} from "./make-operator-2-to-n";
import {BaseType} from "../../type-util";

export type Comparison2ToNReturn<
    Arg0T extends BuiltInExpr<NonNullComparableType>,
    Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Comparison2ToN =
    <
        Arg0T extends BuiltInExpr<NonNullComparableType>,
        Arg1T extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        Comparison2ToNReturn<Arg0T, Arg1T, ArgsT>
    )
;

export function makeComparison2ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    Comparison2ToN
) {
    return makeOperator2ToN<OperatorTypeT, any, boolean>(
        operatorType,
        tm.mysql.boolean(),
        typeHint
    );
}
