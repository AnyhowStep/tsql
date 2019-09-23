import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const tan = makeOperator1<OperatorType.TANGENT, number, number>(
    OperatorType.TANGENT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
