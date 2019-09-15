import {makeComparison, Comparison} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal
 *
 * This version of the `=` operator prevents `NULL`.
 *
 * For null-safe equality, @see {@link nullSafeEq}
 *
 * -----
 *
 * Interestingly enough, if I remove the `Comparison` explicit type annotation,
 * TS takes **much** longer to compile.
 */
export const eq : Comparison = makeComparison(
    OperatorType.EQUAL
);
