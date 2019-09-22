import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

/**
 * Treats both arguments as integers and performs integer division
 *
 * -----
 *
 * ### Divide by zero
 *
 * ```sql
 *  SELECT 9223372036854775807 DIV 0; -- MySQL
 *  SELECT 9223372036854775807 / 0; -- PostgreSQL, SQLite
 * ```
 * The above gives `NULL` for MySQL and SQLite.
 * The above throws an error for PostgreSQL.
 */
export const integerDiv = makeBinaryOperator<OperatorType.INTEGER_DIVISION, bigint, bigint|null>(
    OperatorType.INTEGER_DIVISION,
    tm.mysql.unsafeBigInt().orNull(),
    TypeHint.BIGINT
);
