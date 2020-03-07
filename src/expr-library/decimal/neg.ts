import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1DoubleElimination, Operator1} from "../factory";

/**
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 */
export const neg : Operator1<Decimal, Decimal> = makeOperator1DoubleElimination<OperatorType.UNARY_MINUS, Decimal, Decimal>(
    OperatorType.UNARY_MINUS,
    decimalMapper,
    TypeHint.DECIMAL
);
