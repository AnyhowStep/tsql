import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const exp = makeOperator1<OperatorType.NATURAL_EXPONENTIATION, Decimal, Decimal>(
    OperatorType.NATURAL_EXPONENTIATION,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
