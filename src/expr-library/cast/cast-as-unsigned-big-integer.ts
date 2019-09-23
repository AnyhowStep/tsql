import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

/**
 * PostgreSQl and SQLite do not support `BIGINT UNSIGNED`.
 *
 * Using this may work fine on MySQL but produce inconsistent results on other DBMS.
 */
export const castAsUnsignedBigInteger = makeOperator1Idempotent<OperatorType.CAST_AS_UNSIGNED_BIG_INTEGER, PrimitiveExpr|Decimal, bigint|null>(
    OperatorType.CAST_AS_UNSIGNED_BIG_INTEGER,
    tm.mysql.bigIntUnsigned().orNull()
);
