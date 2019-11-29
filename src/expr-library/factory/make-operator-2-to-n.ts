import * as tm from "type-mapping";
import {RawExpr, RawExprUtil, AnyBuiltInExpr} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {AssertNonNever} from "../../type-util";

export type Operator2ToNReturn<
    OutputTypeT,
    Arg0T extends AnyBuiltInExpr,
    Arg1T extends AnyBuiltInExpr,
    ArgsT extends readonly AnyBuiltInExpr[]
> =
    ExprUtil.Intersect<
        OutputTypeT,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Operator2ToN<
    InputType0T,
    InputType1T,
    InputTypeRestT,
    OutputTypeT
> =
    <
        Arg0T extends RawExpr<InputType0T>,
        Arg1T extends RawExpr<InputType1T>,
        ArgsT extends readonly RawExpr<InputTypeRestT>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        Operator2ToNReturn<OutputTypeT, Arg0T, Arg1T, ArgsT>
    )
;
export function makeOperator2ToN<
    OperatorTypeT extends OperatorType,
    InputTypeT=never,
    OutputTypeT=never
> (
    operatorType : (
        & OperatorTypeT
        & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>
        & AssertNonNever<[InputTypeT], "InputTypeT">
    ),
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2ToN<InputTypeT, InputTypeT, InputTypeT, OutputTypeT>
);
export function makeOperator2ToN<
    OperatorTypeT extends OperatorType,
    InputType0T=never,
    InputType1T=never,
    InputTypeRestT=never,
    OutputTypeT=never
> (
    operatorType : (
        & OperatorTypeT
        & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>
        & AssertNonNever<[InputType0T], "InputType0T">
        & AssertNonNever<[InputType1T], "InputType1T">
        & AssertNonNever<[InputTypeRestT], "InputTypeRestT">
    ),
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2ToN<InputType0T, InputType1T, InputTypeRestT, OutputTypeT>
);
export function makeOperator2ToN<
    OperatorTypeT extends OperatorType,
    InputType0T=never,
    InputType1T=never,
    InputTypeRestT=never,
    OutputTypeT=never
> (
    operatorType : (
        & OperatorTypeT
        & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>
        & AssertNonNever<[InputType0T], "InputType0T">
        & AssertNonNever<[InputType1T], "InputType1T">
        & AssertNonNever<[InputTypeRestT], "InputTypeRestT">
    ),
    mapper : tm.SafeMapper<OutputTypeT>,
    typeHint? : TypeHint
) : (
    Operator2ToN<InputType0T, InputType1T, InputTypeRestT, OutputTypeT>
) {
    const result : (
        Operator2ToN<InputType0T, InputType1T, InputTypeRestT, OutputTypeT>
    ) = <
        Arg0T extends RawExpr<InputType0T>,
        Arg1T extends RawExpr<InputType1T>,
        ArgsT extends readonly RawExpr<InputTypeRestT>[]
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
