import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const extractFractionalSecond3 = makeOperator1<OperatorType.EXTRACT_FRACTIONAL_SECOND_3, Date, number>(
    OperatorType.EXTRACT_FRACTIONAL_SECOND_3,
    tm.mysql.double(),
    TypeHint.DATE_TIME
);

export const extractIntegerSecond = makeOperator1<OperatorType.EXTRACT_INTEGER_SECOND, Date, bigint>(
    OperatorType.EXTRACT_INTEGER_SECOND,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

export const extractMinute = makeOperator1<OperatorType.EXTRACT_MINUTE, Date, bigint>(
    OperatorType.EXTRACT_MINUTE,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

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
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
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
