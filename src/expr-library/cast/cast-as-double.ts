import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsDouble = makeOperator1Idempotent<OperatorType.CAST_AS_DOUBLE, BuiltInValueExpr|Decimal, number|null>(
    OperatorType.CAST_AS_DOUBLE,
    tm.mysql.double().orNull()
);
