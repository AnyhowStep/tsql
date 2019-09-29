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

export const timestampDiffHour = makeOperator2<OperatorType.TIMESTAMPDIFF_HOUR, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_HOUR,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);

export const timestampDiffDay = makeOperator2<OperatorType.TIMESTAMPDIFF_DAY, Date, Date, bigint>(
    OperatorType.TIMESTAMPDIFF_DAY,
    tm.mysql.bigIntSigned(),
    TypeHint.DATE_TIME
);
