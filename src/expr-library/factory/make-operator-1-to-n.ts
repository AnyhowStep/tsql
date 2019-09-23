import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Operator1ToNReturn<
    InputTypeT,
    OutputTypeT,
    Arg0T extends RawExpr<InputTypeT>,
    ArgsT extends readonly RawExpr<InputTypeT>[]
> =
    ExprUtil.Intersect<
        OutputTypeT,
        Arg0T|ArgsT[number]
    >
;
export type Operator1ToN<
    InputTypeT,
    OutputTypeT
> =
    <
        Arg0T extends RawExpr<InputTypeT>,
        ArgsT extends readonly RawExpr<InputTypeT>[]
    > (
        arg0 : Arg0T,
        ...args : ArgsT
    ) => (
        Operator1ToNReturn<InputTypeT, OutputTypeT, Arg0T, ArgsT>
    )
;
export function makeOperator1ToN<
    OperatorTypeT extends OperatorType,
    InputTypeT,
    OutputTypeT
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator1ToN<InputTypeT, OutputTypeT>
) {
    const result : Operator1ToN<InputTypeT, OutputTypeT> = <
        Arg0T extends RawExpr<InputTypeT>,
        ArgsT extends readonly RawExpr<InputTypeT>[]
    > (
        arg0 : Arg0T,
        ...args : ArgsT
    ) : (
        ExprUtil.Intersect<
            OutputTypeT,
            Arg0T|ArgsT[number]
        >
    ) => {
        return ExprUtil.intersect<OutputTypeT, Arg0T|ArgsT[number]>(
            mapper,
            [arg0, ...args],
            OperatorNodeUtil.operatorNode1ToN<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(arg0),
                    ...args.map(RawExprUtil.buildAst),
                ],
                typeHint
            )
        );
    };

    return result;
}
