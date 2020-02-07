import * as tm from "type-mapping";
import {makeOperator2} from "../../factory";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {OperatorNodeUtil} from "../../../ast";

/**
 * Performs a **signed** bitwise right-shift.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_right-shift
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://www.sqlite.org/lang_expr.html#binaryops
 *
 * -----
 *
 * + MySQL        : `CAST(x >> y AS SIGNED)`
 *   + MySQL performs an **unsigned** bitwise right-shift; so we cast to signed to emulate intended behaviour.
 * + PostgreSQL   : `>>`
 * + SQLite       : `>>`
 *
 * -----
 *
 * If the RHS is negative, the behaviour is cannot be unified.
 *
 * + MySQL      : `2 >> -1` is `0`
 * + PostgreSQL : `2 >> -1` is `0`
 * + SQLite     : `2 >> -1` is `4`
 * + JavaScript : `2 >> -1` is `0`
 *
 * -----
 *
 * @param left  - The value to perform the shift on
 * @param right - The amount of bits to shift; undefined behaviour if negative
 *
 * @see bitwiseRightShift
 */
export const bitwiseRightShiftUnsafe = makeOperator2<OperatorType.BITWISE_RIGHT_SHIFT, bigint, bigint>(
    OperatorType.BITWISE_RIGHT_SHIFT,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);

/**
 * Performs a **signed** bitwise right-shift.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_right-shift
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://www.sqlite.org/lang_expr.html#binaryops
 *
 * -----
 *
 * + MySQL        : `CAST(x >> y AS SIGNED)`
 *   + MySQL performs an **unsigned** bitwise right-shift; so we cast to signed to emulate intended behaviour.
 * + PostgreSQL   : `>>`
 * + SQLite       : `>>`
 *
 * -----
 *
 * If the RHS is negative, this throws.
 *
 * -----
 *
 * @param left  - The value to perform the shift on
 * @param right - The amount of bits to shift; throws if negative
 *
 * @see bitwiseRightShiftUnsafe
 */
export function bitwiseRightShift<
    LeftT extends BuiltInExpr<bigint>
> (
    left : LeftT,
    right : bigint
) : (
    ExprUtil.Intersect<bigint, LeftT>
) {
    tm.bigIntGtEq(tm.BigInt(0))(`RHS`, right);
    return ExprUtil.intersect<bigint, LeftT|bigint>(
        tm.mysql.bigIntSigned(),
        [left, right],
        OperatorNodeUtil.operatorNode2<OperatorType.BITWISE_RIGHT_SHIFT>(
            OperatorType.BITWISE_RIGHT_SHIFT,
            [
                BuiltInExprUtil.buildAst(left),
                BuiltInExprUtil.buildAst(right),
            ],
            TypeHint.BIGINT_SIGNED
        )
    ) as ExprUtil.Intersect<bigint, LeftT>;
}
