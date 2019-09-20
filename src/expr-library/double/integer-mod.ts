import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeBinaryOperator} from "../factory";

/**
 * The remainder after performing integer division
 */
export const integerMod = makeBinaryOperator<OperatorType.INTEGER_MODULO, number, number>(
    OperatorType.INTEGER_MODULO,
    tm.mysql.double()
);
