import {decimalMapper} from "./decimal-mapper";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const asin = makeOperator1<OperatorType.ARC_SINE, Decimal, Decimal|null>(
    OperatorType.ARC_SINE,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
