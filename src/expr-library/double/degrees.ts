import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

export const degrees = makeUnaryOperator<OperatorType.DEGREES, number, number>(
    OperatorType.DEGREES,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
