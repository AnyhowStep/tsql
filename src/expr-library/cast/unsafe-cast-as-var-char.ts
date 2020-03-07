import * as tm from "type-mapping";
import {makeOperator1Idempotent, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * Attempts to cast to `VARCHAR`.
 *
 * **Behaviour is not unified.**
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
 * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
 * + https://www.sqlite.org/datatype3.html
 *
 * -----
 *
 * + MySQL          : `CAST(x AS CHAR)`
 *   + `CAST(TRUE AS CHAR)` returns `'1'`
 *   + `CAST(123e0 AS CHAR)` returns `'123'`
 * + PostgreSQL     : `CAST(x AS VARCHAR)`
 *   + `CAST(TRUE AS VARCHAR)` returns `'true'`
 *   + `CAST(CAST(123e0 AS DOUBLE PRECISION) AS VARCHAR)` returns `'123'`
 * + SQLite         : `CAST(x AS VARCHAR)`
 *   + `CAST(TRUE AS VARCHAR)` returns `'1'`
 *   + `CAST(123e0 AS VARCHAR)` returns `'123.0'`
 *
 * -----
 *
 * + https://github.com/AnyhowStep/tsql/issues/15
 */
export const unsafeCastAsVarChar : Operator1<unknown, string|null> = makeOperator1Idempotent<OperatorType.CAST_AS_VARCHAR, unknown, string|null>(
    OperatorType.CAST_AS_VARCHAR,
    tm.orNull(tm.string())
);
