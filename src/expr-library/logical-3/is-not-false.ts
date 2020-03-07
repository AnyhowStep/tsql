import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not
 *
 * Tests whether a value is not `FALSE`.
 *
 * ```sql
 * mysql> SELECT (1 IS NOT FALSE), (0 IS NOT FALSE), (NULL IS NOT FALSE);
 *         -> 1, 0, 1
 * ```
 *
 * -----
 *
 * PostgreSQL does not allow `(0 IS NOT FALSE)` because PostgreSQL
 * has an actual `boolean` type.
 */
/**
 * @todo Monitor this PR,
 * https://github.com/microsoft/TypeScript/issues/33561
 */
export const isNotFalse : Operator1<boolean|null, boolean> = makeOperator1<OperatorType.IS_NOT_FALSE, boolean|null, boolean>(
    OperatorType.IS_NOT_FALSE,
    tm.mysql.boolean(),
    TypeHint.BOOLEAN
);
