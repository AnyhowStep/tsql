import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator} from "../factory";

/**
 * Treats both arguments as integers and performs integer division
 */
export const integerDiv = makeBinaryOperator<OperatorType.INTEGER_DIVISION, number, number|null>(
    OperatorType.INTEGER_DIVISION,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
