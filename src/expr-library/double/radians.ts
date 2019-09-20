import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const radians = makeUnaryOperator<OperatorType.RADIANS, number, number>(
    OperatorType.RADIANS,
    tm.mysql.double()
);
