import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";
import {Decimal} from "../../decimal";

export const degrees = makeUnaryOperator<OperatorType.DEGREES, Decimal, Decimal>(
    OperatorType.DEGREES,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
