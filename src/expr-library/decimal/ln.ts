import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln = makeUnaryOperator<OperatorType.LN, Decimal, Decimal|null>(
    OperatorType.LN,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
