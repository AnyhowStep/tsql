import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * Performs fractional division **first**.
 *
 * Then, truncates the fractional part and returns a `SIGNED BIGINT`.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_div
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-TYPE-CASTS
 *
 * -----
 *
 * + MySQL        : `DIV`
 * + PostgreSQL   : `CAST(TRUNCATE(CAST(x AS NUMERIC) / CAST(y AS NUMERIC), 0) AS BIGINT)`
 * + SQLite       : `CAST(x/y AS BIGINT)`
 *   + SQLite does not have `DECIMAL` data type support...
 *
 * -----
 *
 * `1e0 DIV 0e0`,
 *
 * + MySQL      : `NULL`
 * + PostgreSQL : throws
 * + SQLite     : `NULL`
 *
 * -----
 *
 * `1e308 DIV 1e0`,
 *
 * + MySQL      : throws
 * + PostgreSQL : throws
 * + SQLite     : `9223372036854776000` (Because `CAST(1e308 AS BIGINT)` is `9223372036854776000`)
 *
 * -----
 *
 * `9223372036854775808e0 DIV 1e0`,
 *
 * + MySQL      : throws
 * + PostgreSQL : throws
 * + SQLite     : `9223372036854776000` (Because `CAST(9223372036854775808e0 AS BIGINT)` is `9223372036854776000`)
 *
 * -----
 *
 * `9223372036854770000e0 DIV 1e0`,
 *
 * + MySQL      : `9223372036854770000`
 * + PostgreSQL : `9223372036854770000`
 * + SQLite     : `9223372036854776000` (Because `CAST(9223372036854775808e0 AS BIGINT)` is `9223372036854776000`)
 *
 *
 */
export const integerDiv = makeOperator2<OperatorType.INTEGER_DIVISION, number, bigint|null>(
    OperatorType.INTEGER_DIVISION,
    tm.mysql.bigIntSigned().orNull(),
    TypeHint.DOUBLE
);
