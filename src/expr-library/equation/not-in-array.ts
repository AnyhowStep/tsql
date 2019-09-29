/**
 * @todo Refactor `inArray()` and `notInArray()` so they can share code.
 * Something like a `makeInArray()` factory function.
 */
import {makeEquation2ToN, Equation2ToN, Equation1ToNReturn} from "../factory";
import {OperatorType} from "../../operator-type";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";

const notInArrayImpl : Equation2ToN = makeEquation2ToN<OperatorType.NOT_IN>(
    OperatorType.NOT_IN
);
/**
 * The `NOT IN` operator has two overloads.
 * + `x NOT IN (y0, y1, y2, y3, ...)`
 * + `x NOT IN (SELECT y FROM ...)`
 *
 * This implementation is for the first overload.
 *
 * -----
 *
 * The first argument cannot be `null` because `NULL NOT IN (...)` is always `NULL`.
 *
 * The array cannot contain `null` because,
 * + `x NOT IN (NULL)` is `NULL`
 * + `1 NOT IN (NULL, 2)` is `NULL`
 * + `1 NOT IN (NULL, 2, 1)` is `false`
 *
 * -----
 *
 * Calling `notInArray()` with an empty array will always
 * return `true` because a value is always **not** in an array of zero elements.
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
export function notInArray<
    Arg0T extends RawExpr<NonNullEquatableType>,
    ArgsT extends readonly RawExpr<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<Arg0T>>>[]
> (
    arg0 : Arg0T,
    args : ArgsT
) : (
    Equation1ToNReturn<Arg0T, ArgsT>
) {
    const [arg1, ...rest] = args;
    if (arg1 == undefined) {
        /**
         * Calling `notInArray()` with an empty array will always
         * return `true` because a value is always **not** in an array of zero elements.
         */
        return ExprUtil.fromRawExpr(true) as Equation1ToNReturn<Arg0T, ArgsT>;
    } else {
        return notInArrayImpl<Arg0T, ArgsT[number], ArgsT[number][]>(
            arg0, arg1, ...rest
        );
    }
}
