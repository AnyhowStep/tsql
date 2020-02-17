import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * Returns the remainder after fractional division.
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_mod
 * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_mod
 * + https://stackoverflow.com/questions/53486669/modulo-operation-on-floating-point-numbers-on-postgresql
 *
 * -----
 *
 * + MySQL      : `dividend % divisor`
 * + PostgreSQL : `dividend - FLOOR(dividend / divisor) * divisor`
 * + SQLite     : `dividend - FLOOR(dividend / divisor) * divisor`
 *
 */
export const fractionalRemainder = makeOperator2<OperatorType.FRACTIONAL_REMAINDER, number, number|null>(
    OperatorType.FRACTIONAL_REMAINDER,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
