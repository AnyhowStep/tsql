import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";
import {Decimal} from "../../decimal";

export const radians = makeUnaryOperator<OperatorType.RADIANS, Decimal, Decimal>(
    OperatorType.RADIANS,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
