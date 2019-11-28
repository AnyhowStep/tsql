import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsSignedBigInteger = makeOperator1Idempotent<OperatorType.CAST_AS_SIGNED_BIG_INTEGER, BuiltInValueExpr|Decimal, bigint|null>(
    OperatorType.CAST_AS_SIGNED_BIG_INTEGER,
    tm.mysql.bigIntSigned().orNull()
);
