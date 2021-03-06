import {makeNullSafeEquation1, NullSafeEquation1} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not-null
 *
 * Tests whether a value is not `NULL`.
 *
 * ```sql
 * mysql> SELECT (1 IS NOT NULL), (0 IS NOT NULL), (NULL IS NOT NULL);
 *         -> 1, 1, 0
 * ```
 */
export const isNotNull : NullSafeEquation1 = makeNullSafeEquation1(
    OperatorType.IS_NOT_NULL
);
