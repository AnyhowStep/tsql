import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1Idempotent, Operator1} from "../factory";
import {TypeHint} from "../../type-hint";

/**
 * This function is idempotent.
 * `ABS(ABS(x)) == ABS(x)`
 *
 * -----
 *
 * ### `BIGINT SIGNED` too large
 *
 * ```sql
 *  SELECT ABS(-9223372036854775808)
 * ```
 * The above throws an error on MySQL, PostgreSQL and SQLite.
 */
export const abs : Operator1<bigint, bigint> = makeOperator1Idempotent<OperatorType.ABSOLUTE_VALUE, bigint, bigint>(
    OperatorType.ABSOLUTE_VALUE,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
