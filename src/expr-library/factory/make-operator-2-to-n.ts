import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export type Operator2ToNReturn<
    InputTypeT,
    OutputTypeT,
    Arg0T extends RawExpr<InputTypeT>,
    Arg1T extends RawExpr<InputTypeT>,
    ArgsT extends readonly RawExpr<InputTypeT>[]
> =
    ExprUtil.Intersect<
        OutputTypeT,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Operator2ToN<
    InputTypeT,
    OutputTypeT
> =
    <
        Arg0T extends RawExpr<InputTypeT>,
        Arg1T extends RawExpr<InputTypeT>,
        ArgsT extends readonly RawExpr<InputTypeT>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        Operator2ToNReturn<InputTypeT, OutputTypeT, Arg0T, Arg1T, ArgsT>
    )
;
export function makeOperator2ToN<
    OperatorTypeT extends OperatorType,
    InputTypeT=never,
    OutputTypeT=never
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>,
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2ToN<InputTypeT, OutputTypeT>
) {
    const result : Operator2ToN<InputTypeT, OutputTypeT> = <
        Arg0T extends RawExpr<InputTypeT>,
        Arg1T extends RawExpr<InputTypeT>,
        ArgsT extends readonly RawExpr<InputTypeT>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) : (
        ExprUtil.Intersect<
            OutputTypeT,
            Arg0T|Arg1T|ArgsT[number]
        >
    ) => {
        return ExprUtil.intersect<OutputTypeT, Arg0T|Arg1T|ArgsT[number]>(
            mapper,
            [arg0, arg1, ...args],
            OperatorNodeUtil.operatorNode2ToN<OperatorTypeT>(
                operatorType,
                [
                    RawExprUtil.buildAst(arg0),
                    RawExprUtil.buildAst(arg1),
                    ...args.map(RawExprUtil.buildAst),
                ],
                typeHint
            )
        );
    };

    return result;
}
