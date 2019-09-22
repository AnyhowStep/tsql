import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";
import {Decimal} from "../../decimal";

export const cbrt = makeUnaryOperator<OperatorType.CUBE_ROOT, Decimal, Decimal>(
    OperatorType.CUBE_ROOT,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
