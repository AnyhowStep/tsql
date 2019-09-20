import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const log2 = makeUnaryOperator<OperatorType.LOG2, number, number>(
    OperatorType.LOG2,
    tm.mysql.double()
);
