import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const cos = makeOperator1<OperatorType.COSINE, Decimal, Decimal>(
    OperatorType.COSINE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
