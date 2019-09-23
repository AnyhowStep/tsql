import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";

/**
 * The second argument is the number of decimal places; an integer.
 */
export const truncate = makeOperator2<OperatorType.TRUNCATE, number, bigint, number>(
    OperatorType.TRUNCATE,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
