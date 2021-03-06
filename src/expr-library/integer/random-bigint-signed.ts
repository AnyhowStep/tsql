import * as tm from "type-mapping";
import {makeOperator0, Operator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns a random `BIGINT SIGNED` in the range,
 * [-9223372036854775808, 9223372036854775807]
 *
 * -----
 *
 * MySQL,
 * ```sql
 *  CAST(
 *      CAST(RAND() AS DECIMAL(40,20)) * (9223372036854775807 + 9223372036854775808) - 9223372036854775808
 *      AS SIGNED
 *  )
 * ```
 *
 * PostgreSQL,
 * ```sql
 *  CAST(
 *      CAST(RANDOM() AS DECIMAL(40,20)) * (9223372036854775807 + 9223372036854775808) - 9223372036854775808
 *      AS BIGINT
 *  )
 * ```
 *
 * SQLite,
 * ```sql
 *  RANDOM()
 * ```
 */
export const randomBigIntSigned : Operator0<bigint> = makeOperator0<OperatorType.RANDOM, bigint>(
    OperatorType.RANDOM,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
