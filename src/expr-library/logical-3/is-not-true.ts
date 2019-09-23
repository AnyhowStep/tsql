import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not
 *
 * Tests whether a value is not `TRUE`.
 *
 * ```sql
 * mysql> SELECT (1 IS NOT TRUE), (0 IS NOT TRUE), (NULL IS NOT TRUE);
 *         -> 0, 1, 1
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(1 IS NOT TRUE)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isNotTrue = makeOperator1<OperatorType.IS_NOT_TRUE, boolean|null, boolean>(
    OperatorType.IS_NOT_TRUE,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
