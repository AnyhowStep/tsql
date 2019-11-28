import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsJson = makeOperator1Idempotent<OperatorType.CAST_AS_JSON, BuiltInValueExpr|Decimal, string|null>(
    OperatorType.CAST_AS_JSON,
    tm.orNull(tm.jsonObjectString())
);
