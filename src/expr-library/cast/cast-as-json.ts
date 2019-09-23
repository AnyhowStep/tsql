import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

export const castAsJson = makeOperator1Idempotent<OperatorType.CAST_AS_JSON, PrimitiveExpr|Decimal, string|null>(
    OperatorType.CAST_AS_JSON,
    tm.orNull(tm.jsonObjectString())
);
