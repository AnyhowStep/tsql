import {makeNullSafeEquation2} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal-to
 *
 * This operator allows `NULL`.
 *
 * This operator performs an equality comparison like the `=` operator,
 * but returns
 * + `true` rather than `NULL` if both operands are `NULL`, and
 * + `false` rather than `NULL` if one operand is `NULL`.
 *
 * For regular equality, @see {@link eq}
 */
export const nullSafeEq = makeNullSafeEquation2(
    OperatorType.NULL_SAFE_EQUAL
);
