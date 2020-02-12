import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1} from "../factory";

/**
 *
 * -----
 *
 * + MySQL          : `CONVERT_TZ(x, '+00:00', @@session.time_zone)`
 * ```sql
 *  SET @@session.time_zone = 'EST';
 *  SELECT
 *      CONVERT_TZ('1970-01-01 03:00:00.123', '+00:00', @@session.time_zone),
 *      FLOOR(UNIX_TIMESTAMP(CONVERT_TZ('1970-01-01 03:00:00.123', '+00:00', @@session.time_zone)));
 *  > 1969-12-31 22:00:00.123
 *  > 10800
 * ```
 * + PostgreSQL     : `(x)::timestamp AT TIME ZONE '+00:00'`
 * ```sql
 *  SET TIME ZONE 'EST';
 *  SELECT
 *      '1970-01-01 03:00:00.123'::timestamp AT TIME ZONE '+00:00',
 *      FLOOR(EXTRACT(
 *          EPOCH FROM (
 *              '1970-01-01 03:00:00.123'::timestamp AT TIME ZONE '+00:00'
 *          )
 *      ))
 *  > 1970-01-01T03:00:00.123Z
 *  > 10800
 * ```
 * + SQLite         : `strftime('%Y-%m-%d %H:%M:%f', x)`
 * ```sql
 *  SELECT
 *      strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 03:00:00.123'),
 *      strftime('%s', strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 03:00:00.123'));
 *  > 1970-01-01 03:00:00.123
 *  > 10800
 * ```
 *
 * -----
 *
 * Treat `x` as representing a `UTC` timestamp.
 *
 */
export const utcStringToTimestamp = makeOperator1<OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR, string, Date|null>(
    OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR,
    tm.mysql.dateTime(3).orNull()
);
