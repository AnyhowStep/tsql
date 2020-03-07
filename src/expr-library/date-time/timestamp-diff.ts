import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the number of milliseconds between two date-times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff
 *
 * -----
 *
 * + MySQL          : `CAST(TIMESTAMPDIFF(MICROSECOND, from, to)/1000.0 AS SIGNED INTEGER)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60*60*1000 + EXTRACT(HOUR FROM (to - from))*60*60*1000 + EXTRACT(MINUTE FROM (to - from))*60*1000 + TRUNC(EXTRACT(SECOND FROM (to - from))*1000)`
 *   + The `TRUNC()` at the end is necessary
 *   + Extracting `SECOND` gives a number with decimal places for milliseconds
 *   + Every `EXTRACT()/TRUNC()` should be wrapped with a cast to `BIGINT`
 * + SQLite         : `CAST( (strftime('%J', to) - strftime('%J', from)) * 24 * 60 * 60 * 1000 AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in milliseconds
 */
export const timestampDiffMillisecond : Operator2<Date, Date, bigint> = makeOperator2<OperatorType.TIMESTAMPDIFF_MILLISECOND, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_MILLISECOND,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

/**
 * Returns the number of seconds between two date-times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPDIFF(SECOND, from, to)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60*60 + EXTRACT(HOUR FROM (to - from))*60*60 + EXTRACT(MINUTE FROM (to - from))*60 + TRUNC(EXTRACT(SECOND FROM (to - from)))`
 *   + The `TRUNC()` at the end is necessary
 *   + Extracting `SECOND` gives a number with decimal places for milliseconds
 * + SQLite         : `CAST( (strftime('%J', to) - strftime('%J', from)) * 24 * 60 * 60 AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in seconds
 */
export const timestampDiffSecond : Operator2<Date, Date, bigint> = makeOperator2<OperatorType.TIMESTAMPDIFF_SECOND, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_SECOND,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

/**
 * Returns the number of minutes between two date-times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPDIFF(MINUTE, from, to)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60 + EXTRACT(HOUR FROM (to - from))*60 + EXTRACT(MINUTE FROM (to - from))`
 * + SQLite         : `CAST( (strftime('%J', to) - strftime('%J', from)) * 24 * 60 AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in minutes
 */
export const timestampDiffMinute : Operator2<Date, Date, bigint> = makeOperator2<OperatorType.TIMESTAMPDIFF_MINUTE, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_MINUTE,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

/**
 * Returns the number of hours between two date-times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPDIFF(HOUR, from, to)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24 + EXTRACT(HOUR FROM (to - from))`
 * + SQLite         : `CAST( (strftime('%J', to) - strftime('%J', from)) * 24 AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in hours
 */
export const timestampDiffHour : Operator2<Date, Date, bigint> = makeOperator2<OperatorType.TIMESTAMPDIFF_HOUR, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_HOUR,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

/**
 * Returns the number of days between two date-times.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPDIFF(DAY, from, to)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))`
 * + SQLite         : `CAST(strftime('%J', to) - strftime('%J', from) AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in days
 */
export const timestampDiffDay : Operator2<Date, Date, bigint> = makeOperator2<OperatorType.TIMESTAMPDIFF_DAY, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_DAY,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);
