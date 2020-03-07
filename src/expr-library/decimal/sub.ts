import {decimalMapper} from "./decimal-mapper";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const sub : Operator2<Decimal, Decimal, Decimal> = makeOperator2<OperatorType.SUBTRACTION, Decimal, Decimal, Decimal>(
    OperatorType.SUBTRACTION,
    decimalMapper,
    TypeHint.DECIMAL
);
