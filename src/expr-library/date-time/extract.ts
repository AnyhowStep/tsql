import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Extracts the second from a date-time, including fractional seconds; accurate to 0.001 second.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * Behaviour is not defined when using 0.0001 second precision (or more precise).
 * SQLite may alternate between truncating and rounding.
 *
 * -----
 *
 * + MySQL          : `EXTRACT(SECOND FROM datetime) + FLOOR(EXTRACT(MICROSECOND FROM datetime) / 1000e0) / 1000e0`
 * ```sql
 *  SELECT
 *      EXTRACT(SECOND FROM timestamp '2010-03-27 14:45:32.456789') +
 *      FLOOR(EXTRACT(MICROSECOND FROM timestamp '2010-03-27 14:45:32.456789') / 1000.0e0) / 1000.0e0
 *  > 32.456
 * ```
 * + PostgreSQL     : `FLOOR(EXTRACT(SECOND FROM datetime) * 1000) / 1000`
 * + SQLite         : `CAST(strftime('%f', datetime) AS DOUBLE)`
 * ```sql
 *  SELECT
 *      strftime('%f', '2010-03-27 14:45:32.456789')
 *  > 32.457
 *  -- The result is rounded, not truncated.
 *  -- If it were truncated, we would get 32.456
 * ```
 * ```sql
 *  SELECT
 *      strftime('%f', '2010-03-27 23:59:59.999999')
 *  > 59.999
 *  -- The result is truncated, not rounded.
 *  -- If it were rounded, we would get 60
 * ```
 *
 * @todo Make behaviour consistent?
 */
export const extractFractionalSecond3 = makeOperator1<OperatorType.EXTRACT_FRACTIONAL_SECOND_3, Date, number>(
    OperatorType.EXTRACT_FRACTIONAL_SECOND_3,
    tm.mysql.double(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the second from a date-time, truncating fractional seconds.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(SECOND FROM datetime)`
 * + PostgreSQL     : `CAST(FLOOR(EXTRACT(SECOND FROM datetime)) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%S', datetime) AS BIGINT)`
 */
export const extractIntegerSecond = makeOperator1<OperatorType.EXTRACT_INTEGER_SECOND, Date, bigint>(
    OperatorType.EXTRACT_INTEGER_SECOND,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the minute from a date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(MINUTE FROM datetime)`
 * + PostgreSQL     : `CAST(EXTRACT(MINUTE FROM datetime) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%M', datetime) AS BIGINT)`
 */
export const extractMinute = makeOperator1<OperatorType.EXTRACT_MINUTE, Date, bigint>(
    OperatorType.EXTRACT_MINUTE,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the hour from a date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(HOUR FROM datetime)`
 * + PostgreSQL     : `CAST(EXTRACT(HOUR FROM datetime) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%H', datetime) AS BIGINT)`
 */
export const extractHour = makeOperator1<OperatorType.EXTRACT_HOUR, Date, bigint>(
    OperatorType.EXTRACT_HOUR,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the day (of the month) from a date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(DAY FROM datetime)`
 * + PostgreSQL     : `CAST(EXTRACT(DAY FROM datetime) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%d', datetime) AS BIGINT)`
 */
export const extractDay = makeOperator1<OperatorType.EXTRACT_DAY, Date, bigint>(
    OperatorType.EXTRACT_DAY,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the month from a date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(MONTH FROM datetime)`
 * + PostgreSQL     : `CAST(EXTRACT(MONTH FROM datetime) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%m', datetime) AS BIGINT)`
 */
export const extractMonth = makeOperator1<OperatorType.EXTRACT_MONTH, Date, bigint>(
    OperatorType.EXTRACT_MONTH,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

/**
 * Extracts the year from a date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * MySQL returns a `bigint signed`.
 * PostgreSQL returns a `double precision`.
 * SQLite returns a `text`.
 *
 * This library casts all results to `BIGINT SIGNED`
 *
 * -----
 *
 * + MySQL          : `EXTRACT(YEAR FROM datetime)`
 * + PostgreSQL     : `CAST(EXTRACT(YEAR FROM datetime) AS BIGINT)`
 * + SQLite         : `CAST(strftime('%Y', datetime) AS BIGINT)`
 */
export const extractYear = makeOperator1<OperatorType.EXTRACT_YEAR, Date, bigint>(
    OperatorType.EXTRACT_YEAR,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);
