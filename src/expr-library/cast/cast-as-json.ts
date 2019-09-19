import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

export const castAsJson = makeIdempotentUnaryOperator<OperatorType.CAST_AS_JSON, PrimitiveExpr|Decimal, string|null>(
    OperatorType.CAST_AS_JSON,
    tm.orNull(tm.jsonObjectString())
);
