import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

export const tan = makeUnaryOperator<OperatorType.TANGENT, number, number>(
    OperatorType.TANGENT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
