import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const sin = makeOperator1<OperatorType.SINE, number, number>(
    OperatorType.SINE,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
