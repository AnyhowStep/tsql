import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";

export const castAsDouble = makeIdempotentUnaryOperator<OperatorType.CAST_AS_DOUBLE, PrimitiveExpr, number|null>(
    OperatorType.CAST_AS_DOUBLE,
    tm.mysql.double().orNull()
);
