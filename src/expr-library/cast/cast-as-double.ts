import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

export const castAsDouble = makeOperator1Idempotent<OperatorType.CAST_AS_DOUBLE, PrimitiveExpr|Decimal, number|null>(
    OperatorType.CAST_AS_DOUBLE,
    tm.mysql.double().orNull()
);
