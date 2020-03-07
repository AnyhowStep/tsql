import * as tm from "type-mapping";
import {makeOperator1, Operator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns a binary string representation of a `bigint` value
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_bin
 *
 * -----
 *
 * + MySQL          : `BIN(x)`
 * + PostgreSQL     : None. Implement with,
 * ```sql
 *  REGEXP_REPLACE(
 *      (x)::bit(64)::varchar(64),
 *      '^0+(\d+)$',
 *      '\1'
 *  )
 * ```
 * + SQLite         : None. Implement with,
 * ```ts
 * //x >= 0
 * (x).toString(2)
 * //x < 0
 * (2n**64n + BigInt(x)).toString(2)
 * ```
 */
export const bin : Operator1<bigint, string> = makeOperator1<OperatorType.BIN, bigint, string>(
    OperatorType.BIN,
    tm.match(/^[01]+$/),
    TypeHint.BIGINT_SIGNED
);
