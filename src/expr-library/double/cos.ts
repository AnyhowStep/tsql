import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";

export const cos = makeOperator1<OperatorType.COSINE, number, number>(
    OperatorType.COSINE,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
