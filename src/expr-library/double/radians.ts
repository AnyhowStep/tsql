import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const radians = makeOperator1<OperatorType.RADIANS, number, number>(
    OperatorType.RADIANS,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
