import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeBinaryOperator} from "../factory";

/**
 * The remainder after performing regular floating-point division
 */
export const fractionalMod = makeBinaryOperator<OperatorType.DECIMAL_MODULO, number, number>(
    OperatorType.DECIMAL_MODULO,
    tm.mysql.double()
);
