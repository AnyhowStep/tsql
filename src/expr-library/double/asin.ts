import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const asin = makeUnaryOperator<OperatorType.ARC_SINE, number, number>(
    OperatorType.ARC_SINE,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
