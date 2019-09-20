import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeBinaryOperator} from "../factory";

/**
 * The second argument is the number of decimal places; an integer.
 */
export const truncate = makeBinaryOperator<OperatorType.TRUNCATE, number, bigint, number>(
    OperatorType.TRUNCATE,
    tm.mysql.double()
);
