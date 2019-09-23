import * as tm from "type-mapping";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

export const castAsNChar = makeOperator1Idempotent<OperatorType.CAST_AS_N_CHAR, PrimitiveExpr|Decimal, string|null>(
    OperatorType.CAST_AS_N_CHAR,
    tm.mysql.longText().orNull()
);
