import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1} from "../factory";

export const utcStringToTimestamp = makeOperator1<OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR, string, Date>(
    OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR,
    tm.mysql.dateTime(3)
);
