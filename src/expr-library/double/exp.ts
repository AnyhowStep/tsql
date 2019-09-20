import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const exp = makeUnaryOperator<OperatorType.NATURAL_EXPONENTIATION, number, number>(
    OperatorType.NATURAL_EXPONENTIATION,
    tm.mysql.double()
);
