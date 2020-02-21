import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

/**
 * Attempts to cast to `BIGINT SIGNED`.
 *
 * **Behaviour is not unified.**
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
 * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
 * + https://www.sqlite.org/datatype3.html
 *
 * -----
 *
 * + MySQL          : `CAST(x AS SIGNED INTEGER)`
 *   + Actually gives a signed `bigint`
 *   + Trying to cast `'123e2'` gives `123`
 * + PostgreSQL     : `CAST(x AS bigint)`
 *   + Trying to cast `'123e2'` throws an error
 * + SQLite         : `CAST(x AS BIGINT)`
 *   + Trying to cast `'123e2'` gives `123`
 *
 * -----
 *
 * + https://github.com/AnyhowStep/tsql/issues/15
 * + https://github.com/AnyhowStep/tsql/issues/244
 * + https://github.com/AnyhowStep/tsql/issues/245
 */
export const unsafeCastAsBigIntSigned = makeOperator1Idempotent<OperatorType.CAST_AS_BIGINT_SIGNED, BuiltInValueExpr|Decimal, bigint|null>(
    OperatorType.CAST_AS_BIGINT_SIGNED,
    tm.mysql.bigIntSigned().orNull()
);
