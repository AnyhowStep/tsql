import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const atan = makeOperator1<OperatorType.ARC_TANGENT, Decimal, Decimal>(
    OperatorType.ARC_TANGENT,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
