import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const asin = makeUnaryOperator<OperatorType.ARC_SINE, number, number>(
    OperatorType.ARC_SINE,
    tm.mysql.double()
);
