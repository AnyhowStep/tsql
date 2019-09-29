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

export const extractDay = makeOperator1<OperatorType.EXTRACT_DAY, Date, bigint>(
    OperatorType.EXTRACT_DAY,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

export const extractMonth = makeOperator1<OperatorType.EXTRACT_MONTH, Date, bigint>(
    OperatorType.EXTRACT_MONTH,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);

export const extractYear = makeOperator1<OperatorType.EXTRACT_YEAR, Date, bigint>(
    OperatorType.EXTRACT_YEAR,
    /**
     * Should not be negative
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);
