import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeDoubleEliminationUnaryOperator} from "../factory";

/**
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 */
export const neg = makeDoubleEliminationUnaryOperator<OperatorType.UNARY_MINUS, number, number>(
    OperatorType.UNARY_MINUS,
    tm.mysql.double()
);
