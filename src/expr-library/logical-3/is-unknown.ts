import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
 *
 * Tests whether a value is `UNKNOWN`.
 * Basically an alias for `IS NULL`
 *
 * ```sql
 * mysql> SELECT (1 IS UNKNOWN), (0 IS UNKNOWN), (NULL IS UNKNOWN);
 *         -> 0, 0, 1
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(0 IS UNKNOWN)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isUnknown = makeOperator1<OperatorType.IS_UNKNOWN, boolean|null, boolean>(
    OperatorType.IS_UNKNOWN,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
