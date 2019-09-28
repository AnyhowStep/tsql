import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const rTrim = makeOperator1<OperatorType.RTRIM, string, string>(
    OperatorType.RTRIM,
    tm.string(),
    TypeHint.STRING
);
