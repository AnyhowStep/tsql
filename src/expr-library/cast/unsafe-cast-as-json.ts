import * as tm from "type-mapping";
import {makeOperator1Idempotent, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * Attempts to cast to `JSON`.
 *
 * **Behaviour is not unified.**
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
 * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
 * + https://www.sqlite.org/datatype3.html
 *
 * -----
 *
 * + MySQL          : `CAST(x AS JSON)`
 *   + `CAST(1 AS JSON)` returns `'1'`
 *   + `CAST('{  "x"  :  "y"  }' AS JSON)` returns `'{"x": "y"}'`
 * + PostgreSQL     : `CAST(x AS JSON)`
 *   + `CAST(1 AS JSON)` throws
 *   + `CAST('{  "x"  :  "y"  }' AS JSON)` returns `'{"x":"y"}'`
 * + SQLite         : `CAST(x AS TEXT)`
 *   + Or implement with user-defined function.
 *   + Or the `JSON()` function?
 *   + https://www.sqlite.org/json1.html#jmini
 *   + SQLite does not have a `JSON` data type; `TEXT` is used for `JSON` values.
 *   + `JSON(1)` returns `'1'`
 *   + `CAST(1 AS TEXT)` returns `'1'`
 *   + `JSON('{  "x"  :  "y"  }')` returns `'{"x":"y"}'`
 *
 * -----
 *
 * + https://github.com/AnyhowStep/tsql/issues/15
 */
export const unsafeCastAsJson : Operator1<unknown, string|null> = makeOperator1Idempotent<OperatorType.CAST_AS_JSON, unknown, string|null>(
    OperatorType.CAST_AS_JSON,
    tm.orNull(tm.string())
);
