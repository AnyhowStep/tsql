import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1Idempotent} from "../factory";
import {TypeHint} from "../../type-hint";

/**
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 *
 * -----
 *
 * ### `SIGNED BIGINT` too large
 *
 * ```sql
 *  SELECT ABS(-9223372036854775808)
 * ```
 * The above throws an error on MySQL, PostgreSQL and SQLite.
 */
export const abs = makeOperator1Idempotent<OperatorType.ABSOLUTE_VALUE, bigint, bigint>(
    OperatorType.ABSOLUTE_VALUE,
    tm.mysql.unsafeBigInt(),
    TypeHint.BIGINT
);
