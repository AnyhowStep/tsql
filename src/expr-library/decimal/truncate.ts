import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeBinaryOperator} from "../factory";

/**
 * The second argument is the Decimal of decimal places; an integer.
 */
export const truncate = makeBinaryOperator<OperatorType.TRUNCATE, Decimal, bigint, Decimal>(
    OperatorType.TRUNCATE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
