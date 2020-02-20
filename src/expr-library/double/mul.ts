import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
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
 *   + `1e308*-1e308` throws
 * + PostgreSQL   : `*`
 *   + `CAST(1e308 AS double precision)*CAST(1e308 AS double precision)` throws
 *   + `CAST(1e308 AS double precision)*CAST(-1e308 AS double precision)` throws
 * + SQLite       : `*`
 *   + `1e308*1e308 = Infinity`
 *   + `1e308*-1e308 = -Infinity`
 *
 * -----
 *
 * In SQLite, multiplication with doubles may return `null`,
 * ```sql
 *  SELECT 0e0 * 1e999;
 *  > null
 * ```
 *
 * This particular function will be emulated in SQLite such that
 * it'll throw an error, instead of returning `null`.
 */
export const mul : ChainableOperator<number> = makeChainableOperator<OperatorType.MULTIPLICATION, number>(
    OperatorType.MULTIPLICATION,
    1,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
