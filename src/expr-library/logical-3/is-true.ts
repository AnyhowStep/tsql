import * as tm from "type-mapping";
import {makeUnaryOperator, UnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
 *
 * Tests whether a value is `TRUE`.
 *
 * ```sql
 * mysql> SELECT (1 IS TRUE), (0 IS TRUE), (NULL IS TRUE);
 *         -> 1, 0, 0
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(1 IS TRUE)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isTrue : UnaryOperator<boolean|null, boolean> = makeUnaryOperator<OperatorType.IS_TRUE, boolean|null, boolean>(
    OperatorType.IS_TRUE,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
