import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const acos = makeUnaryOperator<OperatorType.ARC_COSINE, number, number>(
    OperatorType.ARC_COSINE,
    tm.mysql.double()
);
