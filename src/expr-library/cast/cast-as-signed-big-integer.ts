import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

export const castAsSignedBigInteger = makeIdempotentUnaryOperator<OperatorType.CAST_AS_SIGNED_BIG_INTEGER, PrimitiveExpr|Decimal, bigint|null>(
    OperatorType.CAST_AS_SIGNED_BIG_INTEGER,
    tm.mysql.bigIntSigned().orNull()
);
