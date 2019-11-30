import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullComparableType, ComparableTypeUtil} from "../../comparable-type";

export type ComparisonProjection2ToNReturn<
    Arg0T extends BuiltInExpr<NonNullComparableType>,
    Arg1T extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        BuiltInExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type ComparisonProjection2ToN =
    <
        Arg0T extends BuiltInExpr<NonNullComparableType>,
        Arg1T extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) => (
        ComparisonProjection2ToNReturn<Arg0T, Arg1T, ArgsT>
    )
;
/**
 * @todo Better name?
 *
 * Called `Projection` because it picks one of its arguments as the return value.
 * Similar to picking columns in a query.
 */
export function makeComparisonProjection2ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    ComparisonProjection2ToN
) {
    const result : ComparisonProjection2ToN = <
        Arg0T extends BuiltInExpr<NonNullComparableType>,
        Arg1T extends BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly BuiltInExpr<ComparableTypeUtil.BaseNonNullComparableType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        arg1 : Arg1T,
        ...args : ArgsT
    ) : (
        ExprUtil.Intersect<
            BuiltInExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>,
            Arg0T|Arg1T|ArgsT[number]
        >
    ) => {
        const arr : (Arg0T|Arg1T|ArgsT[number])[] = [arg0, arg1, ...args];
        return ExprUtil.intersect<BuiltInExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>, Arg0T|Arg1T|ArgsT[number]>(
            tm.unsafeOr(
                ...arr.map(BuiltInExprUtil.mapper)
            ),
            arr,
            OperatorNodeUtil.operatorNode2ToN<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(arg0),
                    BuiltInExprUtil.buildAst(arg1),
                    ...args.map(BuiltInExprUtil.buildAst),
                ],
                typeHint
            )
        );
    };

    return result;
}
