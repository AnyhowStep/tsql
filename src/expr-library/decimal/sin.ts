import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const sin = makeOperator1<OperatorType.SINE, Decimal, Decimal>(
    OperatorType.SINE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
