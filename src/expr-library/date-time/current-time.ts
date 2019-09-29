import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Sets year, month, day, to the unix epoch
 */
export const currentTime0 = makeOperator0<OperatorType.CURRENT_TIME_0, Date>(
    OperatorType.CURRENT_TIME_0,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);

/**
 * Sets year, month, day, to the unix epoch
 */
export const currentTime1 = makeOperator0<OperatorType.CURRENT_TIME_1, Date>(
    OperatorType.CURRENT_TIME_1,
    tm.mysql.dateTime(1),
    TypeHint.DATE_TIME
);

/**
 * Sets year, month, day, to the unix epoch
 */
export const currentTime2 = makeOperator0<OperatorType.CURRENT_TIME_2, Date>(
    OperatorType.CURRENT_TIME_2,
    tm.mysql.dateTime(2),
    TypeHint.DATE_TIME
);

/**
 * Sets year, month, day, to the unix epoch
 */
export const currentTime3 = makeOperator0<OperatorType.CURRENT_TIME_3, Date>(
    OperatorType.CURRENT_TIME_3,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);
