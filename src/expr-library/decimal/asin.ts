import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const asin = makeUnaryOperator<OperatorType.ARC_SINE, Decimal, Decimal|null>(
    OperatorType.ARC_SINE,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
