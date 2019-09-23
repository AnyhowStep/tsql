import * as tm from "type-mapping";
import {makeUnaryOperator, UnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not
 *
 * Tests whether a value is not `UNKNOWN`.
 * Basically an alias for `IS NOT NULL`
 *
 * ```sql
 * mysql> SELECT (1 IS NOT UNKNOWN), (0 IS NOT UNKNOWN), (NULL IS NOT UNKNOWN);
 *         -> 1, 1, 0
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(0 IS NOT UNKNOWN)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isNotUnknown : UnaryOperator<boolean|null, boolean> = makeUnaryOperator<OperatorType.IS_NOT_UNKNOWN, boolean|null, boolean>(
    OperatorType.IS_NOT_UNKNOWN,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
