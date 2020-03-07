import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1DoubleElimination, Operator1} from "../factory";

/**
 * Returns the unary minus of the double value
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_unary-minus
 *
 * -----
 *
 * + MySQL        : `-`
 * + PostgreSQL   : `-`
 * + SQLite       : `-`
 *
 * -----
 *
 * This function has the double elimination property.
 * `NEG(NEG(x)) == x`
 */
export const neg : Operator1<number, number> = makeOperator1DoubleElimination<OperatorType.UNARY_MINUS, number, number>(
    OperatorType.UNARY_MINUS,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
