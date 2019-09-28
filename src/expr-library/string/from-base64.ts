import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const fromBase64 = makeOperator1<OperatorType.FROM_BASE64, string, string|null>(
    OperatorType.FROM_BASE64,
    tm.orNull(tm.string()),
    TypeHint.STRING
);
