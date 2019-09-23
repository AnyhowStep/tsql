import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

export const power = makeOperator2<OperatorType.POWER, number, number>(
    OperatorType.POWER,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
