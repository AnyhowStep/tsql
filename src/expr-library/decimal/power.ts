import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";
import {Decimal} from "../../decimal";

export const power = makeOperator2<OperatorType.POWER, Decimal, Decimal>(
    OperatorType.POWER,
    decimalMapper,
    TypeHint.DECIMAL
);
