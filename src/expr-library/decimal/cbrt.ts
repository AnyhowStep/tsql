import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";
import {Decimal} from "../../decimal";

export const cbrt = makeOperator1<OperatorType.CUBE_ROOT, Decimal, Decimal>(
    OperatorType.CUBE_ROOT,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
