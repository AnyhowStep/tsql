import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const timestampAddMillisecond = makeOperator2<OperatorType.TIMESTAMPADD_MILLISECOND, Date, bigint, Date>(
    OperatorType.TIMESTAMPADD_MILLISECOND,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddSecond = makeOperator2<OperatorType.TIMESTAMPADD_SECOND, Date, bigint, Date>(
    OperatorType.TIMESTAMPADD_SECOND,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddMinute = makeOperator2<OperatorType.TIMESTAMPADD_MINUTE, Date, bigint, Date>(
    OperatorType.TIMESTAMPADD_MINUTE,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddHour = makeOperator2<OperatorType.TIMESTAMPADD_HOUR, Date, bigint, Date>(
    OperatorType.TIMESTAMPADD_HOUR,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of days to the date-time.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(DAY, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' day')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' day'
 *  );
 * ```
 */
export const timestampAddDay = makeOperator2<OperatorType.TIMESTAMPADD_DAY, Date, bigint, Date>(
    OperatorType.TIMESTAMPADD_DAY,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of months to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(MONTH, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' month')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' month'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of months to add; following MySQL convention
 * @param right - The date-time to add months to; following MySQL convention
 */
export const timestampAddMonth = makeOperator2<OperatorType.TIMESTAMPADD_MONTH, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_MONTH,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of years to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(YEAR, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' year')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' year'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of years to add; following MySQL convention
 * @param right - The date-time to add years to; following MySQL convention
 */
export const timestampAddYear = makeOperator2<OperatorType.TIMESTAMPADD_YEAR, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_YEAR,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);
