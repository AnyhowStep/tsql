import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullComparableType, ComparableTypeUtil} from "../../comparable-type";

export type ComparisonProjection2ToNReturn<
    Arg0T extends RawExpr<NonNullComparableType>,
    Arg1T extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>,
    ArgsT extends readonly RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        RawExprUtil.TypeOf<Arg0T|Arg1T|ArgsT[number]>,
        Arg0T|Arg1T|ArgsT[number]
    >
;
export type ComparisonProjection2ToN =
    <
        Arg0T extends RawExpr<NonNullComparableType>,
        Arg1T extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>[]
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
        Arg0T extends RawExpr<NonNullComparableType>,
        Arg1T extends RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>,
        ArgsT extends readonly RawExpr<ComparableTypeUtil.BaseNonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>[]
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
