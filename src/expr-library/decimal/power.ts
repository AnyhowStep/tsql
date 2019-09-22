import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";
import {Decimal} from "../../decimal";

export const power = makeBinaryOperator<OperatorType.POWER, Decimal, Decimal>(
    OperatorType.POWER,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
