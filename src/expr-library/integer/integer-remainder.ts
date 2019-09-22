import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

/**
 * The remainder after performing integer division.
 *
 * Integer division is defined as,
 * `dividend / divisor`
 *
 * ```ts
 * result = sign(dividend) * abs(remainder)
 * ```
 *
 * If the dividend is positive, the result is positive.
 * If the dividend is negative, the result is negative.
 *
 * ```ts
 * integerRemainder( 5,  3); //2
 * integerRemainder( 5, -3); //2
 * integerRemainder(-5,  3); //-2
 * integerRemainder(-5, -3); //-2
 * ```
 *
 * -----
 *
 * ### Divide by zero
 *
 * ```sql
 *  SELECT 9223372036854775807 % 0
 * ```
 * The above gives `NULL` for MySQL and SQLite.
 * The above throws an error for PostgreSQL.
 */
export const integerRemainder = makeBinaryOperator<OperatorType.INTEGER_REMAINDER, bigint, bigint|null>(
    OperatorType.INTEGER_REMAINDER,
    tm.mysql.unsafeBigInt().orNull(),
    TypeHint.BIGINT
);
