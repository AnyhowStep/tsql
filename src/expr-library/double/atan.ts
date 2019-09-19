import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const atan = makeUnaryOperator<OperatorType.ARC_TANGENT, number, number>(
    OperatorType.ARC_TANGENT,
    tm.mysql.double()
);
