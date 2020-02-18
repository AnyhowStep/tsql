import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * Performs regular floating-point division
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_divide
 * + https://www.postgresql.org/docs/9.0/functions-math.html
 * + https://www.sqlite.org/lang_expr.html#binaryops
 *
 * -----
 *
 * + MySQL        : `/`
 * + PostgreSQL   : `/`
 * + SQLite       : `/`
 *
 * -----
 *
 * `1e0/0e0`,
 *
 * + MySQL      : `NULL`
 * + PostgreSQL : throws
 * + SQLite     : `NULL`
 *
 * -----
 *
 * `1e308/0.1e0`,
 *
 * + MySQL      : throws
 * + PostgreSQL : throws
 * + SQLite     : `Infinity`
 *
 * -----
 *
 * `1e308/-0.1e0`,
 *
 * + MySQL      : throws
 * + PostgreSQL : throws
 * + SQLite     : `-Infinity`
 *
 * -----
 *
 * MySQL,
 * ```sql
 *  SELECT
 *      3.141592653539793e0 /
 *      6.233523257997525e0;
 *  > 0.5039834654517689
 * ```
 * PostgreSQL,
 * ```sql
 *  SELECT
 *      CAST(3.141592653539793e0 AS DOUBLE PRECISION) /
 *      CAST(6.233523257997525e0 AS DOUBLE PRECISION);
 *  > 0.503983465451769
 * ```
 *
 * SQLite,
 * ```sql
 *  SELECT
 *      3.141592653539793e0 /
 *      6.233523257997525e0;
 *  > 0.5039834654517689
 * ```
 */
export const fractionalDiv = makeOperator2<OperatorType.FRACTIONAL_DIVISION, number, number|null>(
    OperatorType.FRACTIONAL_DIVISION,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
