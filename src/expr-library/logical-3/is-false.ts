import * as tm from "type-mapping";
import {makeUnaryOperator, UnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
 *
 * Tests whether a value is `FALSE`.
 *
 * ```sql
 * mysql> SELECT (1 IS FALSE), (0 IS FALSE), (NULL IS FALSE);
 *         -> 0, 1, 0
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(0 IS FALSE)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isFalse : UnaryOperator<boolean|null, boolean> = makeUnaryOperator<OperatorType.IS_FALSE, boolean|null, boolean>(
    OperatorType.IS_FALSE,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
