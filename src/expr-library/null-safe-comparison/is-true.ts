import {makeNullSafeUnaryComparison, NullSafeUnaryComparison} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
 *
 * Tests whether a value is `TRUE`.
 *
 * ```sql
 * mysql> SELECT (1 IS TRUE), (0 IS TRUE), (NULL IS TRUE);
 *         -> 1, 0, 0
 * ```
 */
export const isTrue : NullSafeUnaryComparison = makeNullSafeUnaryComparison(
    OperatorType.IS_TRUE
);
