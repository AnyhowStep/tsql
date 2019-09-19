import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";

export const castAsByteArray = makeIdempotentUnaryOperator<OperatorType.CAST_AS_BYTE_ARRAY, PrimitiveExpr, Buffer|null>(
    OperatorType.CAST_AS_BYTE_ARRAY,
    tm.mysql.longBlob().orNull()
);
