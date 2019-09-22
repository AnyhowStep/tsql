import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

export const tan = makeUnaryOperator<OperatorType.TANGENT, Decimal, Decimal>(
    OperatorType.TANGENT,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
