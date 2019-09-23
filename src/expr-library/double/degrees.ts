import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const degrees = makeOperator1<OperatorType.DEGREES, number, number>(
    OperatorType.DEGREES,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
