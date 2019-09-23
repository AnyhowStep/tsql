import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const tan = makeOperator1<OperatorType.TANGENT, Decimal, Decimal>(
    OperatorType.TANGENT,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
