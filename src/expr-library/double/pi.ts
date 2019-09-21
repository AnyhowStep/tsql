import * as tm from "type-mapping";
import {makeNullaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const pi = makeNullaryOperator<OperatorType.PI, number>(
    OperatorType.PI,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
