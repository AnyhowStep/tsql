import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const unixTimestampNow = makeOperator0<OperatorType.UNIX_TIMESTAMP_NOW, bigint>(
    OperatorType.UNIX_TIMESTAMP_NOW,
    tm.mysql.bigIntUnsigned(),
    TypeHint.DATE_TIME
);
