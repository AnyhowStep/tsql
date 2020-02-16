import * as tm from "type-mapping/fluent";
import {makeOperator1Idempotent} from "../factory";
import {OperatorType} from "../../operator-type";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {Decimal} from "../../decimal";

export const castAsBinary = makeOperator1Idempotent<OperatorType.CAST_AS_BINARY, BuiltInValueExpr|Decimal, Uint8Array|null>(
    OperatorType.CAST_AS_BINARY,
    tm.instanceOfUint8Array().orNull()
);
