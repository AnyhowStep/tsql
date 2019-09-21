import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

export const power = makeBinaryOperator<OperatorType.POWER, number, number>(
    OperatorType.POWER,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
