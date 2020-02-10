import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the current date.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
 * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
 * + https://www.sqlite.org/lang_datefunc.html
 *
 * -----
 *
 * + MySQL          : `CURRENT_DATE()`
 * + PostgreSQL     : `CURRENT_DATE()`
 * + SQLite         : `strftime('%Y-%m-%d', 'now')`
 *
 * -----
 *
 * Sets hour, minute, second, millisecond to zero.
 */
export const currentDate = makeOperator0<OperatorType.CURRENT_DATE, Date>(
    OperatorType.CURRENT_DATE,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);
