import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator2} from "../factory";

/**
 * Performs regular fixed-point division
 */
export const fractionalDiv = makeOperator2<OperatorType.FRACTIONAL_DIVISION, Decimal, Decimal>(
    OperatorType.FRACTIONAL_DIVISION,
    decimalMapper,
    TypeHint.DECIMAL
);
