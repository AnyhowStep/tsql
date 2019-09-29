import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const currentDate = makeOperator0<OperatorType.CURRENT_DATE, Date>(
    OperatorType.CURRENT_DATE,
    tm.mysql.dateTime(0),
    TypeHint.DATE_TIME
);
