import {makeNullSafeUnaryComparison, NullSafeUnaryComparison} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
 *
 * Tests whether a value is `FALSE`.
 *
 * ```sql
 * mysql> SELECT (1 IS FALSE), (0 IS FALSE), (NULL IS FALSE);
 *         -> 0, 1, 0
 * ```
 */
export const isFalse : NullSafeUnaryComparison = makeNullSafeUnaryComparison(
    OperatorType.IS_FALSE
);
