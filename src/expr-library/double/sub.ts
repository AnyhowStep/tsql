import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the subtraction of the double values
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_minus
 *
 * -----
 *
 * + MySQL        : `-`
 *   + `-1e308 - 1e308` throws
 * + PostgreSQL   : `-`
 *   + `CAST(-1e308 AS DOUBLE PRECISION) - CAST(1e308 AS DOUBLE PRECISION)` throws
 * + SQLite       : `-`
 *   + `-1e308 - 1e308 = -Infinity`
 *
 * -----
 *
 * May return `null` because of SQLite,
 * ```sql
 *  SELECT 1e999 - 1e999;
 *  > null
 * ```
 */
export const sub = makeOperator2<OperatorType.SUBTRACTION, number, number, number|null>(
    OperatorType.SUBTRACTION,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
