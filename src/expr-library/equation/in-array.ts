import {makeEquation2ToN, Equation2ToN, Equation1ToNReturn} from "../factory";
import {OperatorType} from "../../operator-type";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {BuiltInExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";

const inArrayImpl : Equation2ToN = makeEquation2ToN<OperatorType.IN>(
    OperatorType.IN
);
/**
 * The `IN` operator has two overloads.
 * + `x IN (y0, y1, y2, y3, ...)`
 * + `x IN (SELECT y FROM ...)`
 *
 * This implementation is for the first overload.
 *
 * -----
 *
 * The first argument cannot be `null` because `NULL IN (...)` is always `NULL`.
 *
 * The array cannot contain `null` because,
 * + `x IN (NULL)` is `NULL`
 * + `1 IN (NULL, 2)` is `NULL`
 * + `1 IN (NULL, 2, 1)` is `true`
 *
 * -----
 *
 * Calling `inArray()` with an empty array will always
 * return `false` because a value is never in an array of zero elements.
 *
 * -----
 *
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_in
 *
 * > To comply with the SQL standard,
 * > `IN()` returns `NULL` not only if the expression on the left hand side is `NULL`,
 * > but also if no match is found in the list and one of the expressions in the list is `NULL`.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/any-in-some-subqueries.html
 */
export function inArray<
    Arg0T extends BuiltInExpr<NonNullEquatableType>,
    ArgsT extends readonly BuiltInExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
> (
    arg0 : Arg0T,
    args : ArgsT
) : (
    Equation1ToNReturn<Arg0T, ArgsT>
) {
    const [arg1, ...rest] = args;
    if (arg1 == undefined) {
        /**
         * Calling `inArray()` with an empty array will always
         * return `false` because a value is never in an array of zero elements.
         */
        return ExprUtil.fromBuiltInExpr(false) as Equation1ToNReturn<Arg0T, ArgsT>;
    } else {
        return inArrayImpl<Arg0T, ArgsT[number], ArgsT[number][]>(
            arg0, arg1, ...rest
        );
    }
}
