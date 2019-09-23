import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1DoubleElimination} from "../factory";

/**
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 */
export const neg = makeOperator1DoubleElimination<OperatorType.UNARY_MINUS, Decimal, Decimal>(
    OperatorType.UNARY_MINUS,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
