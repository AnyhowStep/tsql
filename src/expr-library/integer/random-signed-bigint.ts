import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns a random `SIGNED BIGINT` in the range,
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
export const randomSignedBigInt = makeOperator0<OperatorType.RANDOM, bigint>(
    OperatorType.RANDOM,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
