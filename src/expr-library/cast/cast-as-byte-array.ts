import * as tm from "type-mapping/fluent";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsByteArray = makeOperator1Idempotent<OperatorType.CAST_AS_BYTE_ARRAY, BuiltInValueExpr|Decimal, Uint8Array|null>(
    OperatorType.CAST_AS_BYTE_ARRAY,
    tm.instanceOfUint8Array().orNull()
);
