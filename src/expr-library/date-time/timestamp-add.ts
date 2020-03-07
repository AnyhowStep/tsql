import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Adds the specified number of milliseconds to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(MICROSECOND, x*1000, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' millisecond')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      (x/1000e0) || ' second'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of milliseconds to add; following MySQL convention
 * @param right - The date-time to add milliseconds to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddMillisecond : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_MILLISECOND, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_MILLISECOND,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of seconds to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(SECOND, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' second')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' second'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of seconds to add; following MySQL convention
 * @param right - The date-time to add seconds to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddSecond : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_SECOND, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_SECOND,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of minutes to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(MINUTE, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' minute')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' minute'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of minutes to add; following MySQL convention
 * @param right - The date-time to add minutes to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddMinute : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_MINUTE, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_MINUTE,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of hours to the date-time.
 *
 * May return `null`, or throw on overflow.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `TIMESTAMPADD(HOUR, x, datetime)`
 * + PostgreSQL     : `datetime + concat(x, ' hour')::interval`
 * + SQLite         :
 * ```sql
 *  strftime(
 *      '%Y-%m-%d %H:%M:%f',
 *      datetime,
 *      x || ' hour'
 *  );
 * ```
 *
 * -----
 *
 * @param left - The number of hours to add; following MySQL convention
 * @param right - The date-time to add hours to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddHour : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_HOUR, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_HOUR,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);

/**
 * Adds the specified number of days to the date-time.
 *
 * May return `null`, or throw on overflow.
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
 *
 * -----
 *
 * @param left - The number of days to add; following MySQL convention
 * @param right - The date-time to add days to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddDay : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_DAY, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_DAY,
    tm.mysql.dateTime(3).orNull(),
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
 * + SQLite         : Complicated implementation.
 *
 * -----
 *
 * @param left - The number of months to add; following MySQL convention
 * @param right - The date-time to add months to; following MySQL convention
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddMonth : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_MONTH, bigint, Date, Date|null>(
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
 *
 * @todo Unify negative overflow behaviour.
 */
export const timestampAddYear : Operator2<bigint, Date, Date|null> = makeOperator2<OperatorType.TIMESTAMPADD_YEAR, bigint, Date, Date|null>(
    OperatorType.TIMESTAMPADD_YEAR,
    tm.mysql.dateTime(3).orNull(),
    TypeHint.DATE_TIME
);
