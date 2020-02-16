import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsBigIntSigned = makeOperator1Idempotent<OperatorType.CAST_AS_BIGINT_SIGNED, BuiltInValueExpr|Decimal, bigint|null>(
    OperatorType.CAST_AS_BIGINT_SIGNED,
    tm.mysql.bigIntSigned().orNull()
);
