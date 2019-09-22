import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `LOG2(0)` === `NULL`
 * + PostgreSQL : `LOG(2, 0)` throws error
 */
export const log2 = makeUnaryOperator<OperatorType.LOG2, Decimal, Decimal|null>(
    OperatorType.LOG2,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
