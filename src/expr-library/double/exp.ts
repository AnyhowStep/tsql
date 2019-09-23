import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const exp = makeOperator1<OperatorType.NATURAL_EXPONENTIATION, number, number>(
    OperatorType.NATURAL_EXPONENTIATION,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
