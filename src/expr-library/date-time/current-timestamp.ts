import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const currentTimestamp0 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_0, Date>(
    OperatorType.CURRENT_TIMESTAMP_0,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);

export const currentTimestamp1 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_1, Date>(
    OperatorType.CURRENT_TIMESTAMP_1,
    tm.mysql.dateTime(1),
    TypeHint.DATE_TIME
);

export const currentTimestamp2 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_2, Date>(
    OperatorType.CURRENT_TIMESTAMP_2,
    tm.mysql.dateTime(2),
    TypeHint.DATE_TIME
);

export const currentTimestamp3 = makeOperator0<OperatorType.CURRENT_TIMESTAMP_3, Date>(
    OperatorType.CURRENT_TIMESTAMP_3,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);
