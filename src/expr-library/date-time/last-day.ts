import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Sets hour, minute, second, fractional second to zero.
 */
export const lastDay = makeOperator1<OperatorType.LAST_DAY, Date, Date>(
    OperatorType.LAST_DAY,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);
