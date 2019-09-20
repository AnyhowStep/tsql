import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeBinaryOperator} from "../factory";

/**
 * Performs regular floating-point division
 */
export const fractionalDiv = makeBinaryOperator<OperatorType.DECIMAL_DIVISION, number, number>(
    OperatorType.DECIMAL_DIVISION,
    tm.mysql.double()
);
