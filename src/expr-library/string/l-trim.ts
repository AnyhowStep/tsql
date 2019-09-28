import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const lTrim = makeOperator1<OperatorType.LTRIM, string, string>(
    OperatorType.LTRIM,
    tm.string(),
    TypeHint.STRING
);
