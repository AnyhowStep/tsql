import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

export const sin = makeUnaryOperator<OperatorType.SINE, Decimal, Decimal>(
    OperatorType.SINE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
