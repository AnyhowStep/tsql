import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const toBase64 = makeOperator1<OperatorType.TO_BASE64, string, string>(
    OperatorType.TO_BASE64,
    tm.string(),
    TypeHint.STRING
);
