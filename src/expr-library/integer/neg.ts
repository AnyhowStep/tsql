import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1DoubleElimination, Operator1} from "../factory";

/**
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 *
 * -----
 *
 * ### `BIGINT SIGNED` too large (from database)
 *
 * Be careful, however,
 * ```sql
 *  CREATE TABLE a (id BIGINT);
 *  INSERT INTO a (id) VALUES (-9223372036854775808);
 *
 *  SELECT
 *      -- 9223372036854775808 is too big
 *      -- to fit in signed bigint
 *      -id
 *  FROM
 *      a
 * ```
 *
 * The above will throw an error on both MySQL and PostgreSQL
 * because `9223372036854775808` is not a valid signed bigint value.
 *
 * SQLite casts to `DOUBLE`.
 *
 * -----
 *
 * ### Double Unary Minus Elimination on Negative `BIGINT SIGNED` Literal
 *
 * The following will not throw an error but will silently
 * cast the result,
 * ```sql
 *  SELECT -(-9223372036854775808);
 * ```
 * Both **do not** error in MySQL and PostgreSQL.
 * PostgreSQL seems to perform double unary minus elimination and treats the result as a `DECIMAL` literal.
 * MySQL seems to perform double unary minus elimination and treats the result as an `BIGINT UNSIGNED` literal.
 *
 * SQLite casts to `DOUBLE`
 *
 * -----
 *
 * ```sql
 *  SELECT -(
 *      CAST(-9223372036854775808 AS BIGINT)
 *  ); -- PostgreSQL
 *
 *  SELECT -(-9223372036854775808 + 0); -- PostgreSQL
 *
 *  SELECT -(
 *      CAST(-9223372036854775808 AS BIGINT SIGNED)
 *  ); -- MySQL
 * ```
 * The above throws an error on PostgreSQL.
 * The above silently casts to an `BIGINT UNSIGNED` on MySQL.
 *
 * SQLite casts to `DOUBLE`.
 *
 * -----
 *
 * ```sql
 *  SELECT
 *      CAST(-(-9223372036854775808) AS BIGINT); -- PostgreSQL
 *
 *  SELECT
 *      CAST(-(-9223372036854775808) AS BIGINT SIGNED); -- MySQL
 * ```
 * The above throws an error on PostgreSQL.
 * The above silently casts to an `BIGINT UNSIGNED`
 *
 * SQLite casts to `DOUBLE`.
 *
 * -----
 *
 * MySQL seems to treat `BIGINT SIGNED` values from **columns** and **literals** differently!
 *
 * -----
 *
 * ### `BIGINT SIGNED` too small.
 *
 * MySQL-specific,
 * ```sql
 *  CREATE TABLE a (id  BIGINT UNSIGNED);
 *  INSERT INTO a (id) VALUES (9223372036854775809);
 *  SELECT -id FROM a;
 * ```
 *
 * `-9223372036854775809` is too small to fit in `BIGINT SIGNED`. This will throw an error.
 *
 * -----
 *
 * ```sql
 *  SELECT -CAST(9223372036854775809 AS UNSIGNED);
 * ```
 * The above gives you a `DECIMAL` type with value `-9223372036854775809` in MySQL.
 * PostgreSQL and SQLite do not have `BIGINT UNSIGNED`.
 *
 * -----
 *
 * MySQL and PostgreSQL query builders should perform the unary minus on the library
 * level as much as possible. However, it is not always feasible...
 *
 * PostgreSQL should perform bigint unary minus with `-CAST(x AS BIGINT)` to avoid implicit conversions.
 *
 * MySQL should just use `CAST(-x AS SIGNED)`.
 *
 * However, on MySQL,
 * `CAST(-18446744073709551615 AS SIGNED)` === `-9223372036854775808` (signed bigint minimum value)
 *
 * It would be nice if it threw an error instead.
 * It throws an error on PostgreSQL.
 *
 * SQLite should have a special `bigintNeg()` polyfill that does not cast to `DOUBLE`
 * and throws an error on overflow.
 */
export const neg : Operator1<bigint, bigint> = makeOperator1DoubleElimination<OperatorType.UNARY_MINUS, bigint, bigint>(
    OperatorType.UNARY_MINUS,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
