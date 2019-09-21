import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

/**
 * Performs regular floating-point division
 */
export const fractionalDiv = makeBinaryOperator<OperatorType.FRACTIONAL_DIVISION, number, number>(
    OperatorType.FRACTIONAL_DIVISION,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
