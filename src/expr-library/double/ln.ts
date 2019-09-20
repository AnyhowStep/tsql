import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const ln = makeUnaryOperator<OperatorType.LN, number, number>(
    OperatorType.LN,
    tm.mysql.double()
);
