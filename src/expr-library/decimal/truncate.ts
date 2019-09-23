import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator2} from "../factory";

/**
 * The second argument is the Decimal of decimal places; an integer.
 */
export const truncate = makeOperator2<OperatorType.TRUNCATE, Decimal, bigint, Decimal>(
    OperatorType.TRUNCATE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
