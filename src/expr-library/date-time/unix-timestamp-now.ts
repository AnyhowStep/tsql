import * as tm from "type-mapping";
import {makeOperator0, Operator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns a Unix timestamp representing seconds since '1970-01-01 00:00:00' UTC.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_unix-timestamp
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `UNIX_TIMESTAMP()`
 * + PostgreSQL     :
 * ```sql
 *  FLOOR(
 *      EXTRACT(EPOCH FROM (
 *          CURRENT_TIMESTAMP -
 *          timestamp '1970-01-01 00:00:00' AT TIME ZONE '00:00'
 *      ))
 *  )
 * ```
 * + SQLite         : `strftime('%s', 'now')`
 */
export const unixTimestampNow : Operator0<bigint> = makeOperator0<OperatorType.UNIX_TIMESTAMP_NOW, bigint>(
    OperatorType.UNIX_TIMESTAMP_NOW,
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);
