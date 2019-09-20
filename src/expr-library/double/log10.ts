import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const log10 = makeUnaryOperator<OperatorType.LOG10, number, number>(
    OperatorType.LOG10,
    tm.mysql.double()
);
