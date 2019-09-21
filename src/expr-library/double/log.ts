import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

export const log = makeBinaryOperator<OperatorType.LOG, number, number>(
    OperatorType.LOG,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
