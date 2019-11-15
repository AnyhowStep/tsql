import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";
import {Decimal} from "../../decimal";

export const degrees = makeOperator1<OperatorType.DEGREES, Decimal, Decimal>(
    OperatorType.DEGREES,
    decimalMapper,
    TypeHint.DECIMAL
);
