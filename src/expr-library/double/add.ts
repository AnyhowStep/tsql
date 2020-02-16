import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the addition of the double values
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_plus
 *
 * -----
 *
 * + MySQL        : `+`
 *   + `1e308+1e308` throws
 *   + `(-1e308)+(-1e308)` throws
 * + PostgreSQL   : `+`
 *   + `CAST(1e308 AS double precision)+CAST(1e308 AS double precision)` throws
 *   + `CAST(-1e308 AS double precision)+CAST(-1e308 AS double precision)` throws
 * + SQLite       : `+`
 *   + `1e308+1e308 = Infinity`
 *   + `(-1e308)+(-1e308) = -Infinity`
 */
export const add : ChainableOperator<number> = makeChainableOperator<OperatorType.ADDITION, number>(
    OperatorType.ADDITION,
    0,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
