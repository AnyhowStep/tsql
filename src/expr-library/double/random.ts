import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const random = makeOperator0<OperatorType.RANDOM, number>(
    OperatorType.RANDOM,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
