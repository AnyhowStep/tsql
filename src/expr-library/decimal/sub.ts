import {decimalMapper} from "./decimal-mapper";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const sub = makeOperator2<OperatorType.SUBTRACTION, Decimal, Decimal, Decimal>(
    OperatorType.SUBTRACTION,
    decimalMapper,
    TypeHint.DECIMAL
);
