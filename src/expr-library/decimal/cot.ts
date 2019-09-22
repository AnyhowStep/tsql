import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

/**
 * + MySQL      : `COT(0)` throws error
 * + PostgreSQL : `COT(0)` === `NULL`
 */
export const cot = makeUnaryOperator<OperatorType.COTANGENT, Decimal, Decimal|null>(
    OperatorType.COTANGENT,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
