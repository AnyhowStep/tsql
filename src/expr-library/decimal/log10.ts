import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LOG10(0)` === `NULL`
 * + PostgreSQL : `LOG(10, 0)` throws error
 */
export const log10 = makeUnaryOperator<OperatorType.LOG10, Decimal, Decimal|null>(
    OperatorType.LOG10,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
