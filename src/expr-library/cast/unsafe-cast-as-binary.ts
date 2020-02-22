import * as tm from "type-mapping/fluent";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * Attempts to cast to `BINARY/bytea/BLOB`.
 *
 * **Behaviour is not unified.**
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
 * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
 * + https://www.sqlite.org/datatype3.html
 *
 * -----
 *
 * + MySQL          : `CAST(x AS BINARY)`
 *   + `CAST(1234567890 AS BINARY)` returns `[49,50,51,52,53,54,55,56,57,48]`
 *     + Converts to ASCII string first, then to BINARY
 * + PostgreSQL     : `CAST(x AS bytea)`
 *   + `CAST(1234567890 AS bytea)` throws
 * + SQLite         : `CAST(x AS BLOB)`
 *   + `CAST(1234567890 AS BLOB)` returns `[49,50,51,52,53,54,55,56,57,48]`
 *     + Converts to ASCII string first, then to BLOB
 *
 * -----
 *
 * + https://github.com/AnyhowStep/tsql/issues/15
 */
export const unsafeCastAsBinary = makeOperator1Idempotent<OperatorType.CAST_AS_BINARY, unknown, Uint8Array|null>(
    OperatorType.CAST_AS_BINARY,
    tm.instanceOfUint8Array().orNull()
);
