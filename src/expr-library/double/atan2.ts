import * as tm from "type-mapping";
import {makeBinaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const atan2 = makeBinaryOperator<OperatorType.ARC_TANGENT_2, number, number>(
    OperatorType.ARC_TANGENT_2,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
