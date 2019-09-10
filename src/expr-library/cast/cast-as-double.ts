import * as tm from "type-mapping";
import {makeUnaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";

export const castAsDouble = makeUnaryOperator<OperatorType.CAST_AS_DOUBLE, PrimitiveExpr, number|null>(
    OperatorType.CAST_AS_DOUBLE,
    tm.mysql.double().orNull()
);
