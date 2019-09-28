import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * -----
 *
 * ### `SIGNED BIGINT` too large
 *
 * ```sql
 *  SELECT 9223372036854775807+9223372036854775807;
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `SIGNED BIGINT` too small
 *
 * ```sql
 *  SELECT -9223372036854775808+-9223372036854775808
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `UNSIGNED BIGINT` too large
 *
 * ```sql
 *  SELECT 18446744073709551615+18446744073709551615
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `UNSIGNED BIGINT`; this is adding two `DECIMAL`s.
 * SQLite has no concept of `UNSIGNED BIGINT`; this is adding two `DOUBLE`s.
 *
 * -----
 *
 * ### `UNSIGNED BIGINT` too small
 *
 * ```sql
 *  SELECT 18446744073709551615 + -9223372036854775808 + -9223372036854775808
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `UNSIGNED BIGINT`; this is of type `DECIMAL` and the result is correctly `-1`.
 * SQLite has no concept of `UNSIGNED BIGINT`; this is of type `DOUBLE` and the result is **incorrectly** `0`.
 *
 * -----
 *
 * ### Ensuring consistent behaviour
 *
 * PostgreSQL's behaviour is perfect for `SIGNED BIGINT`.
 *
 * MySQL's behaviour is perfect for `SIGNED BIGINT`.
 *
 * To ensure consistent behaviour across DBMS, **do not** use `UNSIGNED BIGINT` for math.
 * It is fine to use it as an auto-increment identifier in MySQL.
 * Just don't perform math on it.
 *
 * SQLite should have a special `bigintAdd()` polyfill that does not cast to `DOUBLE`
 * and throws an error on overflow.
 */
export const add : ChainableOperator<bigint> = makeChainableOperator<OperatorType.ADDITION, bigint>(
    OperatorType.ADDITION,
    tm.BigInt(0),
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT
);
