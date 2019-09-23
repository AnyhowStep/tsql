import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator2} from "../factory";

/**
 * Performs regular floating-point division
 */
export const fractionalDiv = makeOperator2<OperatorType.FRACTIONAL_DIVISION, Decimal, Decimal>(
    OperatorType.FRACTIONAL_DIVISION,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
