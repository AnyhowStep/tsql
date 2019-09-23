import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln = makeOperator1<OperatorType.LN, Decimal, Decimal|null>(
    OperatorType.LN,
    tm.mysql.decimal().orNull(),
    TypeHint.DECIMAL
);
