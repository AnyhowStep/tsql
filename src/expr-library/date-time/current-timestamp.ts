import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the current date-time, accurate to 1-second.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `CURRENT_TIMESTAMP(0)`
 * + PostgreSQL     : `CURRENT_TIMESTAMP(0)`
 *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
 *
 *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
 *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
 * + SQLite         : `strftime('%Y-%m-%d %H:%M:%S', 'now')` gives precision `0`
 */
export const currentTimestamp0 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_0, Date>(
    OperatorType.CURRENT_TIMESTAMP_0,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);

/**
 * Returns the current date-time, accurate to 0.1-second.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `CURRENT_TIMESTAMP(1)`
 * + PostgreSQL     : `CURRENT_TIMESTAMP(1)`
 *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
 *
 *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
 *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
 * + SQLite         : `substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 21)` gives precision `1`
 */
export const currentTimestamp1 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_1, Date>(
    OperatorType.CURRENT_TIMESTAMP_1,
    tm.mysql.dateTime(1),
    TypeHint.DATE_TIME
);

/**
 * Returns the current date-time, accurate to 0.01-second.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `CURRENT_TIMESTAMP(2)`
 * + PostgreSQL     : `CURRENT_TIMESTAMP(2)`
 *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
 *
 *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
 *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
 * + SQLite         : `substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 22)` gives precision `2`
 */
export const currentTimestamp2 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_2, Date>(
    OperatorType.CURRENT_TIMESTAMP_2,
    tm.mysql.dateTime(2),
    TypeHint.DATE_TIME
);

/**
 * Returns the current date-time, accurate to 0.001-second.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `CURRENT_TIMESTAMP(3)`
 * + PostgreSQL     : `CURRENT_TIMESTAMP(3)`
 *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
 *
 *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
 *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
 * + SQLite         : `strftime('%Y-%m-%d %H:%M:%f', 'now')` gives precision `3`
 */
export const currentTimestamp3 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_3, Date>(
    OperatorType.CURRENT_TIMESTAMP_3,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);
