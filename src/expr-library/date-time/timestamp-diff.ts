import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const timestampDiffMillisecond = makeOperator2<OperatorType.TIMESTAMPDIFF_MILLISECOND, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_MILLISECOND,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

export const timestampDiffSecond = makeOperator2<OperatorType.TIMESTAMPDIFF_SECOND, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_SECOND,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

export const timestampDiffMinute = makeOperator2<OperatorType.TIMESTAMPDIFF_MINUTE, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_MINUTE,
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
 * + MySQL          : `TIMESTAMPDIFF(HOUR, from, to)`
 * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24 + EXTRACT(HOUR FROM (to - from))`
 * + SQLite         : `CAST( (strftime('%J', to) - strftime('%J', from)) * 24 AS BIGINT)`
 *   + We cast to `BIGINT` to be consistent with MySQL
 *
 * -----
 *
 * @param left - The start date-time
 * @param right - The end date-time
 * @returns - Returns `right - left` in days
 */
export const timestampDiffHour = makeOperator2<OperatorType.TIMESTAMPDIFF_HOUR, Date, Date, bigint>(
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
export const timestampDiffDay = makeOperator2<OperatorType.TIMESTAMPDIFF_DAY, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_DAY,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);
