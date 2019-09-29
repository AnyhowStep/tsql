import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";

export type Projection2ToNReturn<
    Arg0T extends RawExpr<NonNullEquatableType>,
    Arg1T extends RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        RawExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type Projection2ToN =
    <
        Arg0T extends RawExpr<NonNullEquatableType>,
        Arg1T extends RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        Projection2ToNReturn<Arg0T, Arg1T, ArgsT>
    )
;
/**
 * @todo Better name?
 *
 * Called `Projection` because it picks one of its arguments as the return value.
 * Similar to picking columns in a query.
 */
export function makeProjection2ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    Projection2ToN
) {
    const result : Projection2ToN = <
        Arg0T extends RawExpr<NonNullEquatableType>,
        Arg1T extends RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) : (
        ExprUtil.Intersect<
            RawExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>,
            Arg0T|Arg1T|ArgsT[number]
        >
    ) => {
        const arr : (Arg0T|Arg1T|ArgsT[number])[] = [arg0, arg1, ...args];
        return ExprUtil.intersect<RawExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>, Arg0T|Arg1T|ArgsT[number]>(
            tm.unsafeOr(
                ...arr.map(RawExprUtil.mapper)
            ),
            arr,
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
