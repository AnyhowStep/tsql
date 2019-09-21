import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

export const cot = makeUnaryOperator<OperatorType.COTANGENT, number, number>(
    OperatorType.COTANGENT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
