import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";

export const castAsVarChar = makeIdempotentUnaryOperator<OperatorType.CAST_AS_VARCHAR, PrimitiveExpr, string|null>(
    OperatorType.CAST_AS_VARCHAR,
    tm.mysql.longText().orNull()
);
