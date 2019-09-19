import * as tm from "type-mapping";
import {makeBinaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const atan2 = makeBinaryOperator<OperatorType.ARC_TANGENT_2, number, number>(
    OperatorType.ARC_TANGENT_2,
    tm.mysql.double()
);
