import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const pi = makeOperator0<OperatorType.PI, number>(
    OperatorType.PI,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
