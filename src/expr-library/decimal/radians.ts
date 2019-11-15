import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";
import {Decimal} from "../../decimal";

export const radians = makeOperator1<OperatorType.RADIANS, Decimal, Decimal>(
    OperatorType.RADIANS,
    decimalMapper,
    TypeHint.DECIMAL
);
