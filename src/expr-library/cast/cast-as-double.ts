import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * Attempts to cast to `DOUBLE`.
 *
 * **Behaviour is not unified.**
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
 * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
 * + https://www.sqlite.org/datatype3.html
 *
 * -----
 *
 * + MySQL 5.7      : `x + 0e0`
 *   + `('qwerty' + 0e0)` returns `0e0`
 *   + `(TRUE + 0e0)` returns `1e0`
 *   + `(9223372036854775807 + 0e0)` returns `9223372036854776000e0`
 * + PostgreSQL     : `CAST(x AS DOUBLE PRECISION)`
 *   + `CAST('qwerty' AS DOUBLE PRECISION)` throws
 *   + `CAST(TRUE AS DOUBLE PRECISION)` throws
 *   + `CAST(9223372036854775807 AS DOUBLE PRECISION)` returns `9223372036854780000e0`
 * + SQLite         : `CAST(x AS DOUBLE)`
 *   + `CAST('qwerty' AS DOUBLE)` returns `0e0`
 *   + `CAST(TRUE AS DOUBLE)` returns `1e0`
 *   + `CAST(9223372036854775807 AS DOUBLE)` returns `9223372036854776000e0`
 *
 * -----
 *
 * + https://github.com/AnyhowStep/tsql/issues/15
 */
export const unsafeCastAsDouble = makeOperator1Idempotent<OperatorType.CAST_AS_DOUBLE, unknown, number|null>(
    OperatorType.CAST_AS_DOUBLE,
    tm.mysql.double().orNull()
);
