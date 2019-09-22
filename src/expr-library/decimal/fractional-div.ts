import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeBinaryOperator} from "../factory";

/**
 * Performs regular floating-point division
 */
export const fractionalDiv = makeBinaryOperator<OperatorType.FRACTIONAL_DIVISION, Decimal, Decimal>(
    OperatorType.FRACTIONAL_DIVISION,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
