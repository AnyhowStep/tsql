import * as tm from "type-mapping";
import {makeIdempotentUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";

/**
 * @todo Add support for accepting `charset_info` as second arg
 */
export const castAsVarChar = makeIdempotentUnaryOperator<OperatorType.CAST_AS_VARCHAR, PrimitiveExpr|Decimal, string|null>(
    OperatorType.CAST_AS_VARCHAR,
    tm.mysql.longText().orNull()
);
