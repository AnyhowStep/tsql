import {makeComparison2ToN, Comparison2ToN, Comparison1ToN, Comparison1ToNReturn} from "../factory";
import {OperatorType} from "../../operator-type";
import {NonNullComparableExpr, ComparableExprUtil} from "../../comparable-expr";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprUtil} from "../../expr";

const inListImpl : Comparison2ToN = makeComparison2ToN<OperatorType.IN>(
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
 * The rest argument cannot contain `null` because,
 * + `x IN (NULL)` is `NULL`
 * + `1 IN (NULL, 2)` is `NULL`
 * + `1 IN (NULL, 2, 1)` is `true`
 *
 * -----
 *
 * Calling `inList()` with only 1 argument, `x`, will always
 * return `false` because a value is never is a list of zero elements.
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
export const inList : Comparison1ToN = (
    <
        Arg0T extends RawExpr<NonNullComparableExpr>,
        ArgsT extends readonly RawExpr<ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        ...args : ArgsT
    ) : (
        Comparison1ToNReturn<Arg0T, ArgsT>
    ) => {
        const [arg1, ...rest] = args;
        if (arg1 == undefined) {
            /**
             *
             * Calling `inList()` with only 1 argument, `x`, will always
             * return `false` because a value is never is a list of zero elements.
             */
            return ExprUtil.fromRawExpr(false) as Comparison1ToNReturn<Arg0T, ArgsT>;
        } else {
            return inListImpl<Arg0T, ArgsT[number], ArgsT[number][]>(
                arg0, arg1, ...rest
            );
        }
    }
);
