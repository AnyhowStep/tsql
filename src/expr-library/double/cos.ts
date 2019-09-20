import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeUnaryOperator} from "../factory";

export const cos = makeUnaryOperator<OperatorType.COSINE, number, number>(
    OperatorType.COSINE,
    tm.mysql.double()
);
