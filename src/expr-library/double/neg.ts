import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1DoubleElimination} from "../factory";

/**
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 */
export const neg = makeOperator1DoubleElimination<OperatorType.UNARY_MINUS, number, number>(
    OperatorType.UNARY_MINUS,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
