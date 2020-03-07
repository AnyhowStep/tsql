import {decimalMapper} from "./decimal-mapper";
import {makeOperator0, Operator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const random : Operator0<Decimal> = makeOperator0<OperatorType.RANDOM, Decimal>(
    OperatorType.RANDOM,
    decimalMapper,
    TypeHint.DECIMAL
);
