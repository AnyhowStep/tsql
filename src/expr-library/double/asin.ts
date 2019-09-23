import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const asin = makeOperator1<OperatorType.ARC_SINE, number, number|null>(
    OperatorType.ARC_SINE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
