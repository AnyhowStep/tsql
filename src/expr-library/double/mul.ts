import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the multiplication of the double values
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_times
 *
 * -----
 *
 * + MySQL        : `*`
 *   + `1e308*1e308` throws
 * + PostgreSQL   : `*`
 *   + `CAST(1e308 AS double precision)*CAST(1e308 AS double precision)` throws
 * + SQLite       : `*`
 *   + `1e308*1e308 = Infinity`
 *
 * -----
 *
 * May return `null` because of SQLite,
 * ```sql
 *  SELECT 0e0 * 1e999;
 *  > null
 * ```
 */
export const mul = makeOperator2<OperatorType.MULTIPLICATION, number, number, number|null>(
    OperatorType.MULTIPLICATION,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
