import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const sin = makeOperator1<OperatorType.SINE, Decimal, Decimal>(
    OperatorType.SINE,
    decimalMapper,
    TypeHint.DECIMAL
);
