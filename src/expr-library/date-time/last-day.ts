import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the date of the last day of the month.
 *
 * Sets hour, minute, second, fractional second to zero.
 *
 * + https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_last-day
 *
 * -----
 *
 * + MySQL          : `LAST_DAY(datetime)`
 * ```sql
 *  SELECT
 *      LAST_DAY(timestamp '2010-03-27 14:45:32.456789')
 *  > 2010-03-31
 * ```
 * + PostgreSQL     :
 * ```sql
 *  SELECT
 *      (
 *          datetime +
 *          interval '1 month' -
 *          CONCAT(EXTRACT(DAY FROM datetime), ' day')::interval
 *      )::date
 * > 2010-03-31T00:00:00.000Z
 * ```
 * + SQLite         :
 * ```sql
 *  SELECT
 *      strftime(
 *          '%Y-%m-%d',
 *          '2010-03-27 14:45:32.456789',
 *          '+1 month',
 *          '-' || strftime('%d', '2010-03-27 14:45:32.456789') || ' day'
 *      )
 *  > 2010-03-31
 * ```
 */
export const lastDay = makeOperator1<OperatorType.LAST_DAY, Date, Date>(
    OperatorType.LAST_DAY,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);
