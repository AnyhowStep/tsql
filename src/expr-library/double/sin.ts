import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const sin = makeUnaryOperator<OperatorType.SINE, number, number>(
    OperatorType.SINE,
    tm.mysql.double()
);
