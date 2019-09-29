import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {IntegerArithmeticExpr} from "../../integer-arithmetic-expr";
import {ArithmeticExpr} from "../../arithmetic-expr";

export const timestampAddMillisecond = makeOperator2<OperatorType.TIMESTAMPADD_MILLISECOND, Date, ArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_MILLISECOND,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddSecond = makeOperator2<OperatorType.TIMESTAMPADD_SECOND, Date, ArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_SECOND,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddMinute = makeOperator2<OperatorType.TIMESTAMPADD_MINUTE, Date, ArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_MINUTE,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddHour = makeOperator2<OperatorType.TIMESTAMPADD_HOUR, Date, ArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_HOUR,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddDay = makeOperator2<OperatorType.TIMESTAMPADD_DAY, Date, ArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_DAY,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddMonth = makeOperator2<OperatorType.TIMESTAMPADD_MONTH, Date, IntegerArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_MONTH,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);

export const timestampAddYear = makeOperator2<OperatorType.TIMESTAMPADD_YEAR, Date, IntegerArithmeticExpr, Date>(
    OperatorType.TIMESTAMPADD_YEAR,
    tm.mysql.dateTime(3),
    TypeHint.DATE_TIME
);
