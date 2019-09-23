import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const cbrt = makeOperator1<OperatorType.CUBE_ROOT, number, number>(
    OperatorType.CUBE_ROOT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
